import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useState } from "react";

import styles from "./ingredient.style";
import { images } from "../../constants";
import IngredientModal from "../ingredient/modal/IngredientModal";

import Additive from "./svg/Additive";
import Preservative from "./svg/Preservative";
import Chemical from "./svg/Chemical"
import Nutrient from "./svg/Nutrient"

const mapping = {
    "preservative" : images.preservative,
    "additive" : images.additive,
    "nutrient" : images.nutrient,
    "chemical" : images.chemical,
}

const Ingredient = ( {ingredient} ) => {

    const [modalVisible, setModalVisible] = useState(false);

    const onPress = () => {
        setModalVisible(false);
    }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <IngredientModal ingredient={ingredient} onPress={onPress} thumbnail={mapping[ingredient.type]} />
      </Modal>
      <TouchableOpacity style={styles.logoContainer}>
        <Additive 
          size={40}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          {ingredient.name}
        </Text>
      </View>
      <View style={styles.calorieContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          Score
        </Text>
        <Text style={styles.calorieName}>{ingredient.score}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Ingredient;
