import React, { useState} from 'react'
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLocalSearchParams } from 'expo-router';
import {IngredientDisplay, PostIngredientsButton} from "../../../../components"
import {COLORS, SIZES, FONT} from ".././../../../constants"

const Ingredients = () => {

  const [displayText, setDisplayText] = useState("We are processing your ingredients...");

  const [data, setData] = useState(["Enriched Flour Bleached", "Monoglycerides", "Soybean Oil", "Corn Syrup", "Salt", "Corn Starch", "Yeast", "Sugar", "Leavening", "Citric Acid", "Soy Lecithin", "Natural Flavor"]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useLocalSearchParams();
  const { imageUri } = params;

  console.log(imageUri)

  // convert imgPath into b64
  const image = null;

  // call gemini api (display for user)

  // if back button presed, route back
  // if forward button pressed proceed

  // call score endpoint (display for user -- just say getting scores)
  // then call summary endpoint (display for user -- just say getting descriptions)

  // once all have been called and data is received, call storing endpoint --> return back formatted list (display to user --> say that we are adding an entry)

  // on receving the final response, push to Meal screen with ingridient

  // const postIngredients = async () => {
  //   try {
  //       console.log(data);
  //     const response = await axios.post('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/eatup', {
  //       uuid: uuid,
  //       ingredients: data, // CHANGE AFTER YOU TEST
  //       // Add other necessary data or headers as required by your API
  //     });
  //     console.log(response.data); // Handle the response as needed
  //     // router.push({ pathname: '/home/ingredients', params: { name: data[0], data: data.slice(1)}});
  //   } catch (error) {
  //     console.error('Error posting data:', error);
  //   }
  // };

  // const { data, isLoading, error } = useFetch("/ingredients", {"image" : imgPath}, "POST"); // make just return body

  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Text style={styles.headerTitle}>{displayText}</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={200} color={COLORS.secondary} />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong</Text>
      ) : (
        <View>
        <FlatList
          data={data.ingredients}
          renderItem={({ item }) => (
            <IngredientDisplay 
            ingredient={item}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContentContainer}
        />
        </View>
      )}
      </View>
      <View style={styles.centeredView}>
      {
        data.length > 0 && (
          <PostIngredientsButton title="Post Ingredients"/>
        )
      }
    </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
    padding: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.medium,
    color: COLORS.primary,
    padding: 20
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    paddingLeft: 10,
  },
  itemText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.gray,
    paddingLeft: 20,
    paddingBottom: 10
  },
  centeredView: {
    justifyContent: 'center', // Centers content vertically in the container
    alignItems: 'center', // Centers content horizontally in the container
  },
});

export default Ingredients;

