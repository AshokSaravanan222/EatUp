import {Text, SafeAreaView, View} from "react-native";
import { SIZES, FONT, COLORS} from "../../../constants";
import { useLocalSearchParams } from "expo-router";

const Ingredient = () => {



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <Text>Hello Wrold</Text>
    </SafeAreaView>
  );
};

export default Ingredient;