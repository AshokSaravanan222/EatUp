import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLocalSearchParams } from 'expo-router';
import MyButton from '../../gemini/MyButton';
import useFetch from '../../../../hook/useFetch';
import IngredientDisplay from '../../../../components/ingredient/IngredientDisplay';


const Ingredients = ( {imgPath} ) => {

  // convert imgPath into b64

  // call gemini api (display for user)

  // if back button presed, route back
  // if forward button pressed proceed

  // call score endpoint (display for user -- just say getting scores)
  // then call summary endpoint (display for user -- just say getting descriptions)

  // once all have been called and data is received, call storing endpoint --> return back formatted list (display to user --> say that we are adding an entry)

  // on receving the final response, push to Meal screen with ingridient

  const postIngredients = async () => {
    try {
        console.log(data);
      const response = await axios.post('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/eatup', {
        uuid: uuid,
        ingredients: data, // CHANGE AFTER YOU TEST
        // Add other necessary data or headers as required by your API
      });
      console.log(response.data); // Handle the response as needed
      // router.push({ pathname: '/home/ingredients', params: { name: data[0], data: data.slice(1)}});
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const { data, isLoading, error } = useFetch("/ingredients", {"image" : imgPath}, "POST"); // make just return body

  return (
    <SafeAreaView style={styles.container}>
      <View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.headerTitle}>We are processing your photo...</Text>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong</Text>
      ) : (
        <View>
        <Text style={styles.headerTitle}>Here are the ingredients:</Text>
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
          <MyButton title="Post Ingredients" onPress={postIngredients} />
        )
      }
    </View>
      
    </SafeAreaView>
  );
}

export default Ingredients;