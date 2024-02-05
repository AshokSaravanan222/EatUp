import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity} from "react-native";
import { useLocalSearchParams, Stack, useRouter} from "expo-router";
import { COLORS, SIZES, FONT} from "../../../constants";
import { Ingredient } from "../../../components";
import {Ionicons} from '@expo/vector-icons';

const Meal = () => {
  const params = useLocalSearchParams();
  const mealString = params.meal // Assuming `useLocalSearchParams` gives you a method `.get()` to retrieve query parameters
  const meal = JSON.parse(mealString || '{}'); // Parse the string back into an object

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            ><Ionicons name="arrow-back" size={24} color={COLORS.primary} style={{padding: 10}} /></TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />
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
    fontSize: SIZES.xxLarge,
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