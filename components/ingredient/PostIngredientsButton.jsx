import { COLORS } from "../../constants"
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PostIngredientsButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: COLORS.tertiary, // Set your desired color
      padding: 10,
      borderRadius: 5,
      width: 300
    },
    text: {
      color: 'white',
      textAlign: 'center',
    },
  });
  
  export default PostIngredientsButton;