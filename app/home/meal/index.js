import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView} from "react-native";
import { useLocalSearchParams} from "expo-router";
import { COLORS, SIZES, FONT} from "../../../constants";
import { Ingredient } from "../../../components";

const Meal = () => {
  const params = useLocalSearchParams();
  const mealString = params.meal // Assuming `useLocalSearchParams` gives you a method `.get()` to retrieve query parameters
  const meal = JSON.parse(mealString || '{}'); // Parse the string back into an object

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{meal.food}</Text>
        </View>
        <View style={styles.cardsContainer}>
          <FlatList
            data={meal.ingredients}
            renderItem={({ item }) => (
              <Ingredient 
                ingredient={item}
              />
            )}
            keyExtractor={(ingredient) => ingredient.name}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            vertical
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Meal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    paddingBottom: 90, // Add padding to create space for the button
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginTop: SIZES.small,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  footerBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
});