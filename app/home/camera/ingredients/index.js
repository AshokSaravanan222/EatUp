import React, { useState, useEffect} from 'react'
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { router, useLocalSearchParams } from 'expo-router';
import {IngredientDisplay, PostIngredientsButton} from "../../../../components";
import {COLORS, SIZES, FONT} from ".././../../../constants";
import Constants from 'expo-constants';

import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const Ingredients = () => {

  const [displayText, setDisplayText] = useState("");

  const [meal, setMeal] = useState("")
  const [ingredients, setIngredients] = useState([]);
  const [summaries, setSummaries] = useState([])

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useLocalSearchParams();
  const { imageUri } = params;

  async function callGemini() {
    setLoading(true);
    setDisplayText("Calling Gemini API.");
  
    // Check if the imageUri is available
    if (!imageUri) {
      console.error("No image URI available");
      setError(true);
      setDisplayText("No image URI available."); // Update display text to show error message
      setLoading(false);
      return;
    }
  
    try {
      // Convert imageUri into base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
      
      // Make the API call
      const response = await axios.post('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/ingredients', {
        image: base64
      });
  
      // Log and handle the response as needed
      console.log(response.data); 
      setMeal(response.data.meal)
      setDisplayText(response.data.meal);
      setIngredients(response.data.ingredients);
    } catch (error) {
      // Log the error and extract the specific message if available
      console.error('Error posting data:', error.response ? error.response.data : error);
      setError(true); // Set error state
      setDisplayText("Error posting data: " + (error.response ? JSON.stringify(error.response.data) : "An unknown error occurred"));
    } finally {
      setLoading(false); // Ensure loading is false after operation completes or fails
      
    }
  }
  

  async function callOpenAI() {
    setLoading(true);
    setDisplayText("Calling OpenAI API.");
  
    // Check if the imageUri is available
    if (!ingredients) {
      console.error("No ingredients available");
      setError(true);
      setDisplayText("No ingredients available."); // Update display text to show error message
      setLoading(false);
      return;
    }
  
    try {
      // Make the API call
      const response = await axios.post('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/summary', {
        meal: meal,
        ingredients: ingredients
      });

      // Log and handle the response as needed
      console.log(response.data);
      setSummaries(response.data.summaries);
    } catch (error) {
      // Log the error and extract the specific message if available
      console.error('Error posting data:', error.response ? error.response.data : error);
      setError(true); // Set error state
      setDisplayText("Error posting data: " + (error.response ? JSON.stringify(error.response.data) : "An unknown error occurred"));
    } finally {
      setDisplayText("Got info from OpenAI");
      setLoading(false); // Ensure loading is false after operation completes or fails

    }
  }

  const handleIngredients = () => {
    callOpenAI();
  }

  

  // call score endpoint (display for user -- just say getting scores)
  // then call summary endpoint (display for user -- just say getting descriptions)

  // once all have been called and data is received, call storing endpoint --> return back formatted list (display to user --> say that we are adding an entry)

  // on receving the final response, push to Meal screen with ingridient

  useEffect(() => {
    setDisplayText("We are processing your ingredients...");
    // call gemini api (display for user)
    if (imageUri) {
      callGemini();
    }

  }, [imageUri]);

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
          data={ingredients}
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
        ingredients.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
          <View style={{ marginRight: 10 }}>
            <PostIngredientsButton title="Go Back" onPress={() => router.push("home/camera")}/>
          </View>
          <View style={{ marginLeft: 10 }}>
            <PostIngredientsButton title="Next" onPress={handleIngredients}/>
          </View>
          </View>
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

