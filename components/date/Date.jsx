import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useState } from "react";

import styles from "./date.style";
import { COLORS, SIZES } from "../../constants";
import MealCard from "../mealCard/MealCard"

const Date = ({ date, data}) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{date}</Text>
      </View>
      <View style={styles.cardsContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MealCard 
              meal={item}
            />
          )}
          contentContainerStyle={{ columnGap: SIZES.medium }}
          vertical
        />
      </View>
    </View>
  );
};

export default Date;
