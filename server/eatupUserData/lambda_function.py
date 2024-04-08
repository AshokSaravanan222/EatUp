import json
import boto3
from datetime import datetime

s3 = boto3.client("s3")
BUCKET_NAME = "eatupuserdata"

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
    current_date = datetime.now().strftime("%m-%d-%y")
    foods = get_from_s3(key)

    if foods:
        for idx, food in enumerate(foods["items"]):
            if current_date == food["date"]:
                # Adding another meal to existing date
                food["meals"].append(data)
                foods["items"][idx] = food
                
                print(f"Added meal to existing date: {current_date}")
                break  # Exits the for loop
        else:
            # Date does not exist yet, so we add a new entry
            foods["items"].append({"date": current_date, "meals": [data]})
            print(f"Added entry to at new date: {current_date}")

    else:  # Create new user data structure if none exists (REDUNDANT, but for testing purposes)
        foods = {"uuid": key, "items": [{"date": current_date, "meals": [data]}]}
        print("Created new user.")

    s3.put_object(Body=json.dumps(foods), Bucket=BUCKET_NAME, Key=key)
    return data


def lambda_handler(event, context):
    
    # Check if it is a GET request
    if event['requestContext']['http']['method'] == 'GET':
        # Assuming UUID is passed in the header, change 'uuid-header' to the actual header name you use
        uuid = event['headers'].get('uuid', None)
        if uuid:
            data = get_from_s3(uuid)
            if data:
                return {
                    'statusCode': 200,
                    'body': json.dumps(data)
                }
            else:
                foods = {"uuid": uuid, "items": []}
                s3.put_object(Body=json.dumps(foods), Bucket=BUCKET_NAME, Key=uuid)
                print("Created new user.")
                return {
                    'statusCode': 200,
                    'body': json.dumps(foods)
                }

        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'UUID header is missing.'})
            }
    
    
    # Check if the request has a body and if it is valid JSON
    if "body" in event and event["body"] is not None:
        try:
            body = json.loads(event["body"])
            
            # Initial checks for required keys and types
            if "uuid" in body and isinstance(body["uuid"], str) and \
                "meal" in body and isinstance(body["meal"], str) and \
                "ingredients" in body and isinstance(body["ingredients"], list) and \
                "types" in body and isinstance(body["types"], list) and \
                "summaries" in body and isinstance(body["summaries"], list) and \
                "scores" in body and isinstance(body["scores"], list) and \
               all(isinstance(item, str) for item in body["ingredients"]) and \
               all(isinstance(item, str) for item in body["types"]) and \
               all(isinstance(item, str) for item in body["summaries"]) and \
               all(isinstance(item, (int, float)) for item in body["scores"]):
                   uuid = body["uuid"]
                   meal = body["meal"]
                   types = body["types"]
                   ingredients = body["ingredients"]
                   summaries = body["summaries"]
                   scores = body["scores"]
                   
                   ings = []
                   for i in range(len(ingredients)):
                       ings.append({"name": ingredients[i], "score": scores[i], "type": types[i], "summary": summaries[i]})
                   food = {"food": meal, "avgScore": '{0:.1f}'.format(sum(scores)/len(scores)), "ingredients": ings} # check format
                   
                   return {
                        'statusCode': 200,
                        'body': json.dumps(store_in_s3(uuid, food))  # Echoing back the valid input for demonstration
                    }
                
            else:
                # Return an error if any validation fails
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'Invalid input: Check that your JSON structure adheres to the required format (uuid, meal, ingredients, types, summaries, scores).'})
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
