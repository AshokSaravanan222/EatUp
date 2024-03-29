import { StyleSheet, Platform} from "react-native";
import { SIZES, COLORS, SHADOWS } from "../../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      padding: SIZES.medium,
      borderRadius: SIZES.medium,
      backgroundColor: COLORS.secondary,
      ...SHADOWS.medium,
      shadowColor: COLORS.white,
      marginBottom: SIZES.small,
      ...Platform.select({
        ios: {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    logoContainer: {
      width: 50,
      height: 50,
      backgroundColor: COLORS.white,
      borderRadius: SIZES.medium,
      justifyContent: "center",
      alignItems: "center",
    },
    logImage: {
      width: "70%",
      height: "70%",
    },
    textContainer: {
      flex: 1,
      marginHorizontal: SIZES.medium,
    },
    jobName: {
      fontSize: SIZES.medium,
      fontFamily: "DMBold",
      color: COLORS.primary,
    },
    calorieName: {
      fontSize: SIZES.medium,
      fontFamily: "DMBold",
      color: COLORS.green,
    },
    jobType: {
      fontSize: SIZES.small + 2,
      fontFamily: "DMRegular",
      color: COLORS.gray,
      marginTop: 3,
      textTransform: "capitalize",
    },
    calorieContainer: {
      justifyContent: "center",
      alignItems: "center",
    }
  });

  export default styles;