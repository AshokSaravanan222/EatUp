import { SafeAreaView, View, StyleSheet, Button, Text, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { History, CameraButton} from "../../components";
import { useRouter} from "expo-router";
import {Ionicons } from '@expo/vector-icons';

const Page = () => {

  const router = useRouter();

  const onCameraBtnPress = () => {
    router.push("home/camera");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            paddingBottom: 90, // Add padding to create space for the button
          }}
        >
        <History // will fix all of the formatting once I call API to fetch the data.
        
        /> 
        </View>
        <View style={styles.cameraButtonContainer}>
          <CameraButton 
            onPress={onCameraBtnPress}
          />
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