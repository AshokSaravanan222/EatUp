import React from "react";
import { View, TouchableOpacity, Text, Linking, Image, InteractionManager } from "react-native";
import { COLORS, SIZES, FONT} from "../../../constants";
import { AntDesign } from "@expo/vector-icons";

import IngredientLogo from "../IngredientLogo";

const IngredientModal = ({ ingredient, onPress }) => {

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
            <IngredientLogo 
              type={ingredient.type}
              size={100}
            />
          </View>
          <Text style={{ color: COLORS.primary, fontSize: SIZES.xxLarge, fontFamily: FONT.bold, marginTop: 10}}>{ingredient.name}</Text>
        </View>
        <Text style={{ color: COLORS.secondary,  fontSize: SIZES.medium, fontFamily: FONT.regular, marginTop: 10 }}>
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