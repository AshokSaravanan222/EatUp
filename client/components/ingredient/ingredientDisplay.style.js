import React from "react";
import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONT } from "../../constants";

const styles = StyleSheet.create({
    itemText: {
      fontSize: SIZES.medium,
      fontFamily: FONT.medium,
      color: COLORS.gray,
      paddingLeft: 20,
      paddingBottom: 10
    }
  });

  export default styles;