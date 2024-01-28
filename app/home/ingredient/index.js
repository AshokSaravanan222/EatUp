import {Text, SafeAreaView, View} from "react-native";
import { SIZES, FONT, COLORS} from "../../../constants";
import NearbyJobs from "../../../components/ingredient/Nearbyjobs";
import Date from "../../../components/live/date/Date";


const data = {
      items: [
        {
          id: "Apple",
          calories: 110,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 1.1,
        },
        {
          id: "Orange",
          calories: 200,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 10.5,
        },
        {
          id: "Banana",
          calories: 70,
          thumbnail:
            "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          amountEaten: 2.9,
        },
      ],
    }

const Ingredient = () => {
    data = [{"name" : "Sodium", "score": 8, "summary": "This is a summary"}, 
    {"name" : "Hydroxide", "score": 10, "summary": "This is a summary"},
    {"name" : "Bicardonate", "score": 3, "summary": "This is a summary"}]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Date date={"01-28-24"} data={data} />
    </SafeAreaView>
  );
};

export default Ingredient;