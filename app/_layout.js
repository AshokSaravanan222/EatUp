import { useFonts } from "expo-font";
import { COLORS } from '../constants';
import { Slot, Stack } from "expo-router";


export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: "/home",
  };

export default function Layout() {

    const [fontsLoaded] = useFonts({
        DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
        DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
        DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
    <Slot></Slot>
    );
}