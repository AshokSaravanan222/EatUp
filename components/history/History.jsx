import React from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import TextTicker from "react-native-text-ticker";

import styles from "./history.style";
import { COLORS, SIZES, FONT } from "../../constants";
import Date from "../date/Date";
import useFetch from '../../hook/useFetch'; // chance could not work

const data = {
  "items":[
     {
        "date":"01-04-24",
        "meals":[
           {
              "food":"Pretzels",
              "avgScore":9.7,
              "ingredients":[
                 {
                    "name":"Enriched Flour Bleached",
                    "score":8,
                    "type":"preservative",
                    "summary":"A common ingredient in many places, wouldn't trust."
                 },
                 {
                    "name":"Monoglycerides",
                    "score":9,
                    "type":"chemical",
                    "summary":"The chemical can be beneficial for heart disease."
                 },
                 {
                    "name":"Soybean Oil",
                    "score":6,
                    "type":"additive",
                    "summary":"This oil is known to be harmful to the liver. It is banned in Europe, Asia, and America."
                 }
              ]
           },
           {
              "food":"Grilled Chicken Salad",
              "avgScore":8.5,
              "ingredients":[
                 {
                    "name":"Chicken Breast",
                    "score":9,
                    "type":"protein",
                    "summary":"Lean protein source, widely regarded as healthy."
                 },
                 {
                    "name":"Mixed Greens",
                    "score":10,
                    "type":"vegetable",
                    "summary":"Rich in vitamins and minerals, essential for a balanced diet."
                 },
                 {
                    "name":"Olive Oil",
                    "score":9,
                    "type":"fat",
                    "summary":"Heart-healthy fat, beneficial for overall health."
                 }
              ]
           },
           {
              "food":"Fruit Smoothie",
              "avgScore":9,
              "ingredients":[
                 {
                    "name":"Strawberries",
                    "score":10,
                    "type":"fruit",
                    "summary":"High in vitamin C and antioxidants."
                 },
                 {
                    "name":"Bananas",
                    "score":9,
                    "type":"fruit",
                    "summary":"Rich in potassium and fiber."
                 },
                 {
                    "name":"Almond Milk",
                    "score":8,
                    "type":"dairy alternative",
                    "summary":"A dairy-free alternative, low in calories."
                 }
              ]
           }
        ]
     },
     {
        "date":"01-15-24",
        "meals":[
           {
              "food":"Energy Drink",
              "avgScore":5.7,
              "ingredients":[
                 {
                    "name":"Red 40",
                    "score":2,
                    "type":"preservative",
                    "summary":"A common ingredient in many places, wouldn't trust."
                 },
                 {
                    "name":"Citric Acid",
                    "score":5,
                    "type":"nutrient",
                    "summary":"The chemical can be beneficial for heart disease."
                 },
                 {
                    "name":"Water",
                    "score":10,
                    "type":"nutrient",
                    "summary":"This will most likely never be banned."
                 }
              ]
           },
           {
              "food":"Veggie Wrap",
              "avgScore":8.3,
              "ingredients":[
                 {
                    "name":"Whole Wheat Wrap",
                    "score":8,
                    "type":"grain",
                    "summary":"High in fiber, a healthier alternative to white flour."
                 },
                 {
                    "name":"Avocado",
                    "score":10,
                    "type":"vegetable",
                    "summary":"Rich in healthy fats and vitamins."
                 },
                 {
                    "name":"Hummus",
                    "score":9,
                    "type":"legume",
                    "summary":"A great source of protein and fiber."
                 }
              ]
           },
           {
              "food":"Quinoa Salad",
              "avgScore":9,
              "ingredients":[
                 {
                    "name":"Quinoa",
                    "score":10,
                    "type":"grain",
                    "summary":"A complete protein and fantastic gluten-free grain."
                 },
                 {
                    "name":"Cherry Tomatoes",
                    "score":9,
                    "type":"vegetable",
                    "summary":"Low in calories and high in vitamins."
                 },
                 {
                    "name":"Feta Cheese",
                    "score":8,
                    "type":"dairy",
                    "summary":"Adds a tangy flavor, rich in calcium."
                 }
              ]
           }
        ]
     },
     {
        "date":"01-29-24",
        "meals":[
           {
              "food":"Oreos",
              "avgScore":7.3,
              "ingredients":[
                 {
                    "name":"Enriched Flour Bleached",
                    "score":8,
                    "type":"preservative",
                    "summary":"A common ingredient in many places, wouldn't trust."
                 },
                 {
                    "name":"Monoglycerides",
                    "score":9,
                    "type":"chemical",
                    "summary":"The chemical can be beneficial for heart disease."
                 },
                 {
                    "name":"Soybean Oil",
                    "score":6,
                    "type":"additive",
                    "summary":"This oil is known to be harmful to the liver. It is banned in Europe, Asia, and America."
                 }
              ]
           },
           {
              "food":"Baked Salmon",
              "avgScore":9.5,
              "ingredients":[
                 {
                    "name":"Salmon",
                    "score":10,
                    "type":"protein",
                    "summary":"Rich in Omega-3 fatty acids, good for heart health."
                 },
                 {
                    "name":"Lemon",
                    "score":9,
                    "type":"fruit",
                    "summary":"Adds flavor and vitamin C."
                 },
                 {
                    "name":"Dill",
                    "score":9,
                    "type":"herb",
                    "summary":"Herb that adds fresh, tangy flavor to the fish."
                 }
              ]
           },
           {
              "food":"Sweet Potato Fries",
              "avgScore":8.8,
              "ingredients":[
                 {
                    "name":"Sweet Potatoes",
                    "score":10,
                    "type":"vegetable",
                    "summary":"High in beta-carotene and fiber."
                 },
                 {
                    "name":"Olive Oil",
                    "score":9,
                    "type":"fat",
                    "summary":"Used for baking, healthier than deep frying."
                 },
                 {
                    "name":"Paprika",
                    "score":8,
                    "type":"spice",
                    "summary":"Adds a sweet and spicy flavor."
                 }
              ]
           }
        ]
     }
  ]
}

const formatDate = (dateStr) => {
  const [month, day, year] = dateStr.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${months[month - 1]} ${day}, 20${year}`;
  return formattedDate;
};

const History = () => {

  const [title, setTitle] = useState(""); // State for the animated title
  const titleRef = useRef(null);

  const isLoading = false;
  const error = false;
  // const { data, isLoading, error } = useFetch("/user", {"uuid" : "adfadfafa"}, "GET");

useEffect(() => {
  // Simulate a typing animation by updating the title character by character
  const targetTitle = "EatUp";
  let currentIndex = 0;
  const typingInterval = setInterval(() => {
    if (currentIndex < targetTitle.length) {
      setTitle(targetTitle.slice(0, currentIndex + 1));
      currentIndex++;
    } else {
      clearInterval(typingInterval);
    }
  }, 200); // Adjust the typing speed as needed
  return () => {
    clearInterval(typingInterval);
  };
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          <View>
            <FlatList
              data={data.items}
              renderItem={({ item }) => (
                <Date date={formatDate(item.date)} data={item.meals} />
              )}
              keyExtractor={(item) => item.date}
              contentContainerStyle={{ columnGap: SIZES.medium }}
              vertical
              ListHeaderComponent={
                <View>
                  <TextTicker
                ref={titleRef}
                style={{
                  fontFamily: FONT.bold,
                  fontSize: 100,
                  color: COLORS.primary,
                }}
                duration={4000} // Adjust the duration for animation speed
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {title}
              </TextTicker>
              <Image
              source={require("../../assets/food.jpg")}
              resizeMode="cover"
              style={{
                width: 300,
                height: 300,
                borderRadius: 20,
              }}
            />
            </View>
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default History;
