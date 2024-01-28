import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useState } from "react";
import FoodModal from "./modal/FoodModal";
import {checkImageURL} from "../../../utils";

import styles from "./fooditem.style";
import { images } from "../../../constants";

const FoodItem = ( {food} ) => {

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
        <FoodModal food={food} onPress={onPress} thumbnail={images.nutritionLogo} />
      </Modal>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={images.nutritionLogo}
          resizeMode="contain"
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          {food.name}
        </Text>
      </View>
      <View style={styles.calorieContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          Score
        </Text>
        <Text style={styles.calorieName}>{food.score}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FoodItem;
