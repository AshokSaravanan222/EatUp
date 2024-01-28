import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { useState, useEffect } from 'react';

import {COLORS, SIZES, FONT} from "../../../constants"
import Button from '../../../components/live/camera/custombutton/Button';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY);
const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision"})

const prompt = "What are the ingredients displayed in this food item? Respond in the form of a list like the following: ['Citric Acid', 'Soy Lecithin', ...]. If the item is not a food item, simply return []."

const Gemini = () => {

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function fetchDataFromGeminiProVisionAPI() {
        try {
          setLoading(true);
    
          // Request permission to access the media library 
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
          }
    
          // Launch the image picker
          const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
          });
    
          if (pickerResult.cancelled === true) {
            setLoading(false);
            return;
          }
    
          // Constructing GoogleGenerativeAI.Part object
          const imagePart = {
            inlineData: {
              data: pickerResult.base64,
              mimeType: pickerResult.type // Ensure this is a valid MIME type for the API
            }
          };
    
          const result = await visionModel.generateContent([prompt, imagePart]);
          const text = await result.response.text();
          setData(text);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("fetchDataFromGeminiAPI error: ", error);
        }
    }
      useEffect(() => {
        fetchDataFromGeminiProVisionAPI();
      }, []);

    const renderItem = ({ item }) => (
    <Text style={styles.itemText}>{item}</Text>
    );

return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>We are processing your photo...</Text>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={<Text style={styles.headerText}>Ingredient Items</Text>}
          ListFooterComponent={<Text style={styles.footerText}>Footer</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop: SIZES.xLarge,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: SIZES.large,
      fontFamily: FONT.medium,
      color: COLORS.primary,
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
  });
  

export default Gemini;