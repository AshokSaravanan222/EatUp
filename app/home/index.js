import { SafeAreaView, View, StyleSheet, Button, Text, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../../constants";
import { History, CameraButton} from "../../components";
import { useRouter} from "expo-router";
import {Ionicons } from '@expo/vector-icons';

const Page = () => {

  const router = useRouter();
  const uuid = "af7c1fe6-d669-414e-b066-e9733f0de7a8";

  const onCameraBtnPress = () => {
    router.push({ pathname: 'home/camera', params: { uuid: uuid } });
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