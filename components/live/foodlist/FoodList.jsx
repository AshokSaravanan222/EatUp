import React from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import TextTicker from "react-native-text-ticker";
import Slide from "../../hero/Slide";

import styles from "./foodlist.style";
import { COLORS, SIZES, FONT } from "../../../constants";
import Date from "../date/Date";

const data = {
  items: [
    {
      date: "08-09-23",
      data: [
        {
          id: "Apple",
          calories: 110,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 1.1,
        },
        {
          id: "Orange",
          calories: 200,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 10.5,
        },
        {
          id: "Banana",
          calories: 70,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 2.9,
        },
      ],
    },
    {
      date: "08-21-23",
      data: [
        {
          id: "Grapes",
          calories: 110,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 1.1,
        },
        {
          id: "Orange",
          calories: 200,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 1,
        },
        {
          id: "Banana",
          calories: 70,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 3.1,
        },
      ],
    },
    {
      date: "08-13-23",
      data: [
        {
          id: "Bread",
          calories: 200,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 4.9,
        },
        {
          id: "Blueberries",
          calories: 250,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 12.5,
        },
        {
          id: "Kiwi",
          calories: 300,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 0.5,
        },
      ],
    },
  ]
};

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

const FoodList = () => {

  const [title, setTitle] = useState(""); // State for the animated title
  const titleRef = useRef(null);

  const isLoading = false;
  const error = false;

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
              source={require("../../../assets/food.jpg")}
              resizeMode="cover"
              style={{
                width: 300,
                height: 300,
                borderRadius: 20,
              }}
            />
            <Text style={{fontFamily: FONT.bold,
                  fontSize: 20,
                  color: COLORS.primary}}>Snap a picture to get started! We will find all of the ingredients in the image and show you how healthy they are for you. Remember, if its healthy, Eat Up!</Text>
            </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          <View>
            <FlatList
              data={data.items}
              renderItem={({ item }) => (
                <Date date={formatDate(item.date)} data={item.data} />
              )}
              keyExtractor={(item) => item.date}
              contentContainerStyle={{ columnGap: SIZES.medium }}
              vertical
              ListHeaderComponent={
                <Text></Text>
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default FoodList;
