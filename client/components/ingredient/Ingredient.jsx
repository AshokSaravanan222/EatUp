import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useState } from "react";

import styles from "./ingredient.style";
import { images } from "../../constants";
import IngredientModal from "../ingredient/modal/IngredientModal";

import IngredientLogo from "./IngredientLogo";

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
        <IngredientModal ingredient={ingredient} onPress={onPress} />
      </Modal>
      <TouchableOpacity style={styles.logoContainer}>
        <IngredientLogo 
          type={ingredient.type}
          size={30}
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
