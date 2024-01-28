import { SafeAreaView, View, StyleSheet, Button, Text } from "react-native";
import { COLORS, SIZES } from "../../constants";
import { FoodList, CameraButton} from "../../components";
import { useRouter } from "expo-router";

const Page = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            paddingBottom: 90, // Add padding to create space for the button
          }}
        >
          <Button
            onPress={() => router.push("home/ingredient")}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />

          <FoodList />
        </View>
        <View style={styles.cameraButtonContainer}>
          <CameraButton />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.medium,
    backgroundColor: "transparent",
  }
});

export default Page;