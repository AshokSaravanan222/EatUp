import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./nearbyjobcard.style";
import { FONT, SIZES } from "../../constants";

const NearbyJobCard = ({ ingredient }) => {
  console.log(ingredient);
  return (
    <TouchableOpacity style={styles.container}>
      <TouchableOpacity style={styles.logoContainer}>
      <Image
        source={
        require('../../assets/icon.png')
        }
        resizeMode='contain'
        style={styles.logImage}
      />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={2}>
          {ingredient.name}
        </Text>
      </View>
      <Text style={{color: "green", fontSize: SIZES.medium, fontFamily: FONT.bold}}>{ingredient.score}</Text>
    </TouchableOpacity>
  );
};

export default NearbyJobCard;
