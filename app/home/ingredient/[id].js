import {Text, SafeAreaView, View} from "react-native";
import { SIZES, FONT, COLORS} from "../../../constants";
import NearbyJobs from "../../../components/ingredient/Nearbyjobs";

const Ingredient = () => {
    data = [{"name" : "Sodium", "score": 8, "summary": "This is a summary"}, 
    {"name" : "Hydroxide", "score": 10, "summary": "This is a summary"},
    {"name" : "Bicardonate", "score": 3, "summary": "This is a summary"}]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <NearbyJobs 
            data={data}
        />
    </SafeAreaView>
  );
};

export default Ingredient;