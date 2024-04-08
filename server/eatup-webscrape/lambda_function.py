import json
import random

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup
import re
import urllib.request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests
import boto3

nltk.data.path.append("/tmp")
nltk.download('stopwords', download_dir="/tmp")
nltk.download("punkt", download_dir="/tmp")

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

def get_score(ingredient):

    def analyse_sentiments(s_line):
        analyser = SentimentIntensityAnalyzer()

        vs = analyser.polarity_scores(s_line)

        if vs['compound'] >= 0.1:
            return vs['compound']
        elif vs['compound'] <= -0.1:
            return vs['compound']
        else:
            return vs['compound']

    def googleSearch(ingredient):
        def get_search_results(query, num_results=5):
            # Define the search engine URL and headers
            search_url = f"https://www.google.com/search?q={query}"
            #headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

            # Send an HTTP GET request to the search engine
            #response = requests.get(search_url, headers=headers)
            response = requests.get(search_url)


            # Check if the request was successful
            if response.status_code == 200:
                # Parse the HTML content of the page using BeautifulSoup
                soup = BeautifulSoup(response.text, "html.parser")

                # Extract the URLs of the search results
                results = []
                for link in soup.find_all("a", href=True):
                    url = link["href"]
                    if url.startswith("/url?q="):
                        url = url[7:].split("&")[0]
                        results.append(url)
                        if len(results) == num_results:
                            #print(len(results))
                            break

                return results
            else:
                print(f"Failed to retrieve search results. Status code: {response.status_code}")
                return None

        search_query = "Why is {} good for health".format(ingredient)

        result_urls = get_search_results(search_query)

        urls = []
        if result_urls:
            #result_urls = result_urls[2:]
            for i, url in enumerate(result_urls, start=1):
                urls.append(url)
        return urls

    urls = googleSearch(ingredient)
    
    scoreList = []
    for link in urls:
        try:
            scraped_data = urllib.request.urlopen(link)
        except:
            continue
        article = scraped_data.read()

        parsed_article = BeautifulSoup(article,'html.parser')

        paragraphs = parsed_article.find_all('p')

        text = ""

        for p in paragraphs:
            text += p.text

        stopWords = set(stopwords.words("english"))
        words = word_tokenize(text)
        symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '{', '[', '}', ']']

        freqTable = dict()
        for word in words:
            word = word.lower()
            if word in stopWords:
                continue
            if word in symbols:
                continue
            if word in freqTable: 
                freqTable[word] += 1
            else: 
                freqTable[word] = 1

        sentences = sent_tokenize(text)
        sentenceValue = dict()

        for sentence in sentences:
            for word, freq in freqTable.items():
                if word in sentence.lower():
                    if sentence in sentenceValue:
                        sentenceValue[sentence] += freq
                    else: 
                        sentenceValue[sentence] = freq

        sumValues = 0
        s = []
        for sentence in sentenceValue:
            sumValues += sentenceValue[sentence]
            s.append(sentenceValue[sentence])

        summarisedText = []
        # keyDelete = []
        for i, j in sentenceValue.items():
            if (j/max(s)) >= 0.6:
                summarisedText.append(i)

        sentiment = []
        for i in summarisedText:
            sentiment.append(analyse_sentiments(i))
        score = 0
        try:
            score = sum(sentiment)/len(sentiment)
            score = round(score * 10)
            scoreList.append(score)
            # print(score)
        except:
            score = 0
            scoreList.append(score)
            
    if scoreList:
        print(scoreList)
        return round((1.5*sum(scoreList))/len(scoreList))
    return 0

def get_all_scores(ingredients):
    scores = {}
    for ing in ingredients:
        try:
            scores[ing] = get_score(ing.title())
        except:
            print(f"There was an error finding the score for this ingredient: {ing}")
    return scores
    

def lambda_handler(event, context):
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
                    scores = {} # dict of all scores
                    scores_web_scrape = [] # ingredients to get scores
                    
                    # find existing ingredients' scores and add rest to web_scrape
                    for ing in ingredients:
                      if data.get(ing):
                        item = data[ing]
                        try:
                          scores[ing] = item["score"]
                          continue
                        except:
                          print(f"Ingredient present, but no score found for {ing}")
                      else:
                        print("Should never get here! Gemini should have added, but doing anyway.")
                        data[ing] = {}
                      
                      scores_web_scrape.append(ing)
                    
                    # get summaries from openai
                    scores.update(get_all_scores(scores_web_scrape))
                    
                    # adding it back to the ingredients, updating data
                    res = []
                    for ing in ingredients:
                      score = scores.get(ing)
                      data[ing]["score"] = score
                      res.append(score)
                    
                    # storing in s3
                    store_in_s3("ingredients", data)
                    
                    return {
                        'statusCode': 200,
                        'body': json.dumps({'meal': meal, 'scores': res})
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
