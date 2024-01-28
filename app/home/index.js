import { SafeAreaView, View, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";
import { FoodList, CameraButton } from "../../components";

const Page = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            paddingBottom: 90, // Add padding to create space for the button
          }}
        >
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