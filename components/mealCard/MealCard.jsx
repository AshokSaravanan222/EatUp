import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./mealCard.style"
import { images } from "../../constants";
import { useRouter } from "expo-router";

const MealCard = ( {meal} ) => {

const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        const mealString = JSON.stringify(meal);
        router.push({ pathname: '/home/meal', params: { meal: mealString } });
      }}
    >
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={images.nutritionLogo}
          resizeMode="contain"
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          {meal.food}
        </Text>
      </View>
      <View style={styles.calorieContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          Score
        </Text>
        <Text style={styles.calorieName}>{meal.avgScore}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealCard;
