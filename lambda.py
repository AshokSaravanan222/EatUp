import json
import boto3
import base64

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup
import re
import urllib.request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests

nltk.data.path.append("/tmp")
nltk.download('stopwords', download_dir="/tmp")
nltk.download("punkt", download_dir="/tmp")


def get_from_s3(key):

    s3 = boto3.client("s3") 
    BUCKET_NAME = "eatup"

    try:
        response = s3.get_object(
            Bucket=BUCKET_NAME, Key=key
        )  # trying to get response from s3 bucket
        data = response["Body"].read().decode("utf-8")  # finding file content if exists
        return json.loads(data)
    except:
        return None


def store_in_s3(name, score, summary, banned):
    s3 = boto3.client("s3")
    BUCKET_NAME = "eatup"

    data = {"name": name, "score": score, "summary": summary, "banned" : []}

    s3.put_object(Body=json.dumps(data), Bucket=BUCKET_NAME, Key=name)
    return data

# if not in s3 bucket, web scrape to get information
# hardcode the sentiment score for now
def web_scrape(ingredient):

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
            
def web_scrape_v2(ingredient):
    return 0

def get_more_info(ingredient):
    """
    Calls chatGPT for summary and info where it is banned
    """
    return {"summary": "This is the 2 sentecnce summary of the food", "banned": []}


# # event: list of ingredients
# # make dummy webscrape function
def lambda_handler(event, context):
    if "body" not in event or not isinstance(event["body"], str): # test event
        body = event["body"]
    else: # regular
        body = json.loads(event["body"])
    
    uuid = body["uuid"]
    ingredients = body["ingredients"]
    
    avg_score = 0
    ingredients_info = []
    
    for ingredient in ingredients:
        key = ingredient.upper().replace(" ", "-")
        
        status = get_from_s3(key)
        if status:
            # Score
            avg_score += (status['score'])**2
            
        else:

            score = web_scrape_v2(ingredient) # this will take a while
            avg_score += (score)**2

            information = get_more_info(ingredient)
            summary = information.get("summary")
            banned = information.get("banned")
            
            store_in_s3(ingredient, score, summary, banned)
        
        ingredients_info.append(status) 
    
    avg_score = avg_score**(0.5)
    avg_score /= len(ingredients_info)

    
    return {
        'statusCode': 200,
        'body': json.dumps({
            "uuid" : uuid,
            "avg_score" : avg_score,
            "ingredients" : ingredients_info
        })
    }
    