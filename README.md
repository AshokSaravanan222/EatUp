# EatUp
https://github.com/AshokSaravanan222/EatUp/assets/90977640/5d455b21-e84e-407b-9d7b-b5023f099db4
## Inspiration
The genesis of EatUp is rooted in a collective dedication to sustainability and a profound concern for food safety. In an era marked by the proliferation of preservatives and potentially harmful ingredients, safeguarding the integrity of the food we consume has emerged as an imperative. EatUp, as a solution, is designed to empower users by arming them with the knowledge needed to make informed choices about the products they include in their diets.

Our mission is anchored in the belief that in a landscape where the prevalence of additives and questionable components is on the rise, providing users with comprehensive insights into ingredients and their potential health impacts is pivotal. By doing so, EatUp strives to foster a culture of mindful consumption, where individuals can make conscious, health-oriented choices that transcend beyond mere product selection. We envision our platform as a catalyst for cultivating healthier lifestyles and fostering a heightened awareness of the impact of our dietary choices on personal well-being and the broader environment.

## What it does
We employ advanced technology to discern food ingredients through the meticulous scanning of product labels using the Google Gemini API. Subsequently, the identified list of ingredients is transmitted to our AWS Lambda server, where a Python script is executed to conduct web scraping and intricate sentiment analysis on the gathered data.

To optimize computational efficiency, the processed data is securely stored in our S3 bucket, significantly reducing retrieval times for frequently accessed ingredients. The seamless transfer of this enriched dataset from AWS back to the application ensures a swift and reliable integration. The frontend of the application, constructed with React Native, serves as an intuitive interface for users to access and comprehend the meticulously analyzed information.


## How we built it
We initially developed the front end of the application using React Native, seamlessly integrating it with Gemini. This integration enables real-time recognition of text from product images captured by the user. Subsequently, the captured data is transmitted to AWS Lambda, encapsulated within a list that encompasses ingredient details.

To optimize efficiency, our system first checks if the ingredient information is already cached in the S3 bucket. If cached, the data is retrieved directly from the S3 bucket, streamlining the lookup process. In cases where the required data is not present in the cache, we dynamically acquire it by web scraping from reputable sources. This process is executed through a Python script that initiates a Google search, utilizes requests to retrieve articles, and employs Beautiful Soup for parsing. The retrieved data is then summarized using NLTK, enhancing its suitability for subsequent sentiment analysis through VADER sentiment analysis.

Upon completion of the sentiment analysis, each ingredient is assigned a sentiment score. This comprehensive dataset is then transmitted back to AWS Lambda. Subsequently, the refined data is sent back to the React Native application in JSON format via an HTTP request. Upon receipt, the data is unpacked and seamlessly displayed on the screen, offering users a user-friendly interface to access and comprehend the analyzed information.


## Challenges we ran into
A noteworthy challenge in our development journey centered around the creation of a Lambda layer that could seamlessly integrate with all the essential libraries. This endeavor demanded meticulous attention to detail and thoughtful problem-solving, as ensuring compatibility across diverse libraries proved to be a substantial hurdle.

The intricacies of achieving harmonious integration across these libraries required a dedicated investment of time and resources. We engaged in a thorough calibration process for the Python script responsible for determining sentiment scores, recognizing the importance of precision in this aspect of our project.

The commitment to overcoming these challenges has not only fortified our technical capabilities but has also contributed to the robustness of our solution. Through persistent efforts and strategic problem-solving, we have successfully navigated the complexities inherent in creating a Lambda layer that aligns seamlessly with the requisite libraries, ultimately enhancing the efficiency and effectiveness of our sentiment analysis process.


## Accomplishments that we're proud of
We take pride in successfully implementing a web scraping tool and efficiently caching data in the S3 bucket to increase speed of our app. Additionally, our development of a custom-built sentiment analysis solution and a from scratch front end demonstrates our commitment to delivering a robust and personalized user experience.


## What we learned
Our journey with EatUp taught us valuable lessons in integrating different frameworks and technologies into a cohesive full-stack mobile application. From managing API integrations to implementing custom solutions, the project provided a great learning experience for our entire team.


## What's next for EatUp
Looking ahead, EatUp envisions expanding its features to foster a more interactive user experience. Plans include introducing personalized notifications, such as a chiming message of "Eat Up" when the food is deemed safe and enjoyable. By continuously evolving, EatUp aims to enhance user engagement and contribute to a healthier and more sustainable lifestyle.

