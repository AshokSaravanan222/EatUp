import json
import boto3
import urllib3
import os

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
    

def get_summaries(ingredients):
    '''
    :param ingredients: [String] of all the ingredients
    :return [String] with length equal to list of ingredients, each entry containing the summary
    '''

    api_key = os.environ['OPENAI_API_KEY']
    
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {api_key}",
    }
    
    
    data = {
      "model": "gpt-3.5-turbo-0125",
      "response_format": { "type": "json_object" },
      "messages": [
          {
              "role": "system",
              "content": 'You are a nutritionist who answers questions about the safety of food ingredients is two sentences. You output is in the form of JSON, with entries looking like the following: {"ingredient1": "This is first description. This is where it is banned.", "ingredient2": "This is second description. This is where it is banned."} and so on.'
          },
          {
              "role": "user",
              "content": f'Do the following for each ingredient description. Give the summary of the ingredient in the first sentence and the countries its banned in the second sentence. Here are the ingredients: {", ".join(ingredients)}'
          }
      ]
    }
    
    http = urllib3.PoolManager() # Initialize a PoolManager instance
    encoded_data = json.dumps(data).encode('utf-8') # Convert the data dictionary to a JSON string
    
    # Make the POST request
    response = http.request(
        'POST',
        url,
        body=encoded_data,
        headers=headers
    )
    
    # Check the response
    response_data = None
    if response.status == 200:
        print("Request was successful.")
        # Decode response data
        response_data = json.loads(response.data.decode('utf-8'))
        print(response_data)
    else:
        print("Request failed with status code:", response.status)
    
    output = response_data['choices'][0]['message']['content']
    
    summaries = json.loads(output)
    summaries = {ing:summaries.get(ing, "We could not find a summary.") for ing in ingredients}
    
    return summaries

def lambda_handler(event, context):
    
    s3.put_object(Bucket="eatupuserdata", Key='ingredient', Body=json.dumps("hello"))
    
    # Check if the request has a body and if it is valid JSON
    if "body" in event and event["body"] is not None:
        try:
            body = json.loads(event["body"])
            
            # Initial check for 'meal' and 'ingredients' keys
            if "meal" in body and isinstance(body["meal"], str) and \
               "ingredients" in body and isinstance(body["ingredients"], list):
                # Validate that each item in the 'ingredients' list is a string
                if all(isinstance(item, str) for item in body["ingredients"]):
                    
                    # current data on ingredients
                    data = get_from_s3("ingredients")
                    
                    if not data:
                        print("This should be rare. Creating ingredients object")
                        data = {}
                    
                    # ingredients from user
                    meal = body["meal"]
                    ingredients = body["ingredients"]
                    ingredients = [ing.upper() for ing in ingredients]
                    
                    # initializing
                    summaries = {} # dict of all summaries
                    ingredients_openai = [] # ingredients to call open_ai with
                    
                    # find existing ingredients' summary and add rest to openai
                    for ing in ingredients:
                      if data.get(ing):
                        item = data[ing]
                        try:
                          summaries[ing] = item["summary"]
                          continue
                        except:
                          print(f"Ingredient present, but no summary found for {ing}")
                      else:
                        print("Should never get here! Gemini should have added, but doing anyway.")
                        data[ing] = {}
                      
                      ingredients_openai.append(ing)
                    
                    # get summaries from openai
                    summaries.update(get_summaries(ingredients_openai))
                    
                    # adding it back to the ingredients, updating data
                    res = []
                    for ing in ingredients:
                      summary = summaries.get(ing)
                      data[ing]["summary"] = summary
                      res.append(summary)
                    
                    # storing in s3
                    store_in_s3("ingredients", data)
                    
                    return {
                        'statusCode': 200,
                        'body': json.dumps({'meal': meal, 'summaries': res})
                    }
                else:
                    # Return an error if any item in the 'ingredients' list is not a string
                    return {
                        'statusCode': 400,
                        'body': json.dumps({'message': 'Invalid input: Each item in "ingredients" must be a string.'})
                    }
            else:
                # Return an error if either 'meal' is not a string or 'ingredients' key is missing/not a list
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'Invalid input: JSON must contain a "meal" key with a string value and an "ingredients" key with a list of strings.'})
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
