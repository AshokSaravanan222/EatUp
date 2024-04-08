import json
import os
import base64
import urllib3
import boto3
import re

s3 = boto3.client("s3")
BUCKET_NAME = "eatup"

def get_from_s3(key):
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=key)  # Trying to get response from s3 bucket
        data = response['Body'].read().decode('utf-8')  # Finding file content if exists
        return json.loads(data)
    except s3.exceptions.NoSuchKey:
        print(f"No such key: {key}")
        return None
    except Exception as e:
        print(f"Error fetching from S3: {str(e)}")
        return None

def store_in_s3(key, data):
    s3.put_object(Body=json.dumps(data), Bucket=BUCKET_NAME, Key=key)
    return data

def find_data(desc):
  desc = desc.strip()

  # empty string
  if desc == "":
    return ("Unknown", ["Unknown"], ['A'])
  
  try:
    name, ings_desc = desc.split(":")
  except:
    # no name for meal
    name = "Meal"
    ings_desc = desc
  
  ingredients = []
  types = []
  for ing_desc in ings_desc.strip().split(","):
    try:
      ing, typ, _ = re.split(r'[()]', ing_desc)
    except:
      ing = "Unknown"
      typ = "A"
    
    ingredients.append(ing.strip())
    types.append(typ.strip())

  return name, ingredients, types

def lambda_handler(event, context):
    # Check if the request has a body and if it is valid JSON
    if "body" in event and event["body"] is not None:
        try:
            body = json.loads(event["body"])
            # Check for the 'image' key and if its value is a base64 encoded string
            if "image" in body and isinstance(body["image"], str):
                # Validate the base64 string
                try:
                    # Decode the base64 string to ensure it's valid
                    base64.b64decode(body["image"], validate=True)
                except ValueError:
                    # Return an error if the base64 value is invalid
                    return {
                        'statusCode': 400,
                        'body': json.dumps({'message': 'Invalid input: The "image" value must be a valid base64 encoded string.'})
                    }
            else:
                # Return an error if the 'image' key is missing or not a string
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'Invalid input: JSON must contain an "image" key with a base64 encoded image string.'})
                }
        except json.JSONDecodeError:
            # Return an error if the body is not valid JSON
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid JSON format in request body.'})
            }
    else:
        # Return an error if the body is missing
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Request body is missing or empty.'})
        }
    
    api_key = os.environ['GEMINI_API_KEY']
    
    prompt = "What are the ingredients displayed in this food item? Respond in the form of a string of the ingredients separated by commas where the first element is the classification of the food. Do not add any special characters other than spaces, dashes, and alphabet characters to each ingredient. If there are multiple items, only pick the most prominent one. Additionally add a character (A, N, P, or C) in parentheses to the end of each ingredient to classify whether it is, respectfully, a food additive, nutrient, preservative, or chemical. If it is not a food item, simply return the string ‘not food item’. Only output this string, do not output anything else. Here is an example for you to follow. Pretzels: Enriched Flour Bleached(A), Monoglycerides(A), Soybean Oil(N), Corn Syrup(A), Salt(N), Corn Starch(A), Yeast(N), Sugar(N), Leavening(A), Citric Acid(P), Soy Lecithin(A), Natural Flavor(A)"
    
    request_payload = {
      "contents": [
        {
          "parts": [
            {"text": prompt},
            {
              "inline_data": {
                "mime_type": "image/jpeg",
                "data": body["image"]
              }
            }
          ]
        }
      ]
    }
    
    http = urllib3.PoolManager() # Setup urllib3 PoolManager
    
    # Make the POST request
    response = http.request(
        'POST',
        f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={api_key}',
        headers={'Content-Type': 'application/json'},
        body=json.dumps(request_payload)
    )
    
    # Check if the request was successful
    if response.status == 200:
        # Parse the response to extract the text content
        response_data = json.loads(response.data.decode('utf-8'))
        # Assuming the API response format, adjust if necessary
        ingredients_desc = response_data['candidates'][0]['content']['parts'][0]['text']
    else:
        print(f'Request failed with status code: {response.status}')
        ingredients_desc = ""
    
    meal, ingredients, types = find_data(ingredients_desc)
    
    # mapping to types
    types_dict = {'A': 'additive', 'P':'preservative', 'N':'nutrient', 'C' :'chemical'}
    types = [types_dict[typ] for typ in types]
    
    # uppercasing ingredients
    ingredients_upper = [ing.upper() for ing in ingredients]
    
    # current data on ingredients
    data = get_from_s3("ingredients")
    if not data:
        print("This should be rare. Creating ingredients object")
        data = {}
    
    # find existing ingredients' summary and add rest to openai
    for ing, typ in zip(ingredients_upper, types):
        if data.get(ing):
            item = data[ing]
            item["type"] = typ
            data[ing] = item
        else:
            data[ing] = {"type": typ}
    
    # storing in s3
    store_in_s3("ingredients", data)
    
    # ingredients = ["Enriched Flour Bleached", "Monoglycerides", "Soybean Oil", "Corn Syrup", "Salt", "Corn Starch", "Yeast", "Sugar", "Leavening", "Citric Acid", "Soy Lecithin", "Natural Flavor"]
    # meal = "Pretzels"
    # types = ["additive" for _ in ingredients]
    
    return {
        'statusCode': 200,
        'body': json.dumps({"meal": meal, "ingredients" : ingredients, "types": types})
    }
    
    # Since this is an example, returning a success message or proceeding with further processing is up to your requirements.
    # Here, just returning a success response for demonstration purposes
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'The request was successfully processed.'})
    }


    # asking GPT for other checks
    
    # api_key = os.environ['GEMINI_API_KEY']
    
    # url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    # params = {
    #     'key': api_key
    # }
    # headers = {
    #     'Content-Type': 'application/json'
    # }
    # data = {
    #     "contents": [{
    #         "parts": [{
    #             "text": "Write a story about a magic backpack"
    #         }]
    #     }]
    # }
    
    # response = requests.post(url, headers=headers, json=data, params=params)
    
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps(response.json())
    # }
    
    
    
