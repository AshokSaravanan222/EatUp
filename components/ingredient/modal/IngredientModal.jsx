import React from "react";
import { View, TouchableOpacity, Text, Linking, Image, InteractionManager } from "react-native";
import { COLORS } from "../../../constants";
import { AntDesign } from "@expo/vector-icons";

import Additive from "../svg/Additive";
import Preservative from "../svg/Preservative";
import Chemical from "../svg/Chemical"
import Nutrient from "../svg/Nutrient"

const IngredientModal = ({ ingredient, onPress, thumbnail }) => {

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: "85%",
          backgroundColor: COLORS.lightWhite,
          padding: 40,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
          onPress={onPress}
        >
          <AntDesign name="close" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Chemical 
              size={100}
            />
          </View>
          <Text style={{ color: COLORS.primary, fontSize: 25 }}>{ingredient.name}</Text>
          <Text style={{ color: COLORS.primary, fontSize: 20, marginTop: 10 }}>
            Score: {ingredient.score}
          </Text>
        </View>
        <Text style={{ color: COLORS.primary, marginTop: 10 }}>
          {ingredient.summary}
        </Text>
      </View>
    </View>
  );
};

const checkImageURL = (url) => {
  return url && url.startsWith("http");
};

export default IngredientModal;