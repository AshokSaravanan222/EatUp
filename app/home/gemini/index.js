import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLocalSearchParams } from 'expo-router';

import { useState, useEffect } from 'react';

import {COLORS, SIZES, FONT} from "../../../constants"
import Button from '../../../components/live/camera/custombutton/Button';

import * as FileSystem from 'expo-file-system';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY);
const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision"})

const prompt = "What are the ingredients displayed in this food item? Respond in the form of a string seperated by commas: Citric Acid, Soy Lecithin, ... If the item is not a food item, simply return an empty string. Only output this string, do not output anything else."

const Gemini = () => {

    const params = useLocalSearchParams();
    const { imageUri } = params;

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function fetchDataFromGeminiProVisionAPI() {
        try {
          setLoading(true);
    
          // Check if the imageUri is available
          if (!imageUri) {
            console.error("No image URI available");
            setError(true);
            setLoading(false);
            return;
          }
    
          // Read the image file as base64
          const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
          const mimeType = 'image/jpeg'; // Adjust this based on the actual image type
    
          // Constructing GoogleGenerativeAI.Part object
          const imagePart = {
            inlineData: {
              data: base64,
              mimeType
            }
          };
    
          const result = await visionModel.generateContent([prompt, imagePart]);
          const text = await result.response.text();
          const cleanedText = text.replace(/^\[|\]$/g, ''); // Removes leading and trailing brackets
          const items = cleanedText.split(',').map(item => item.trim());
          setData(items);

          console.log(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("fetchDataFromGeminiAPI error: ", error);
        }
    }

    useEffect(() => {
        if (imageUri) {
          fetchDataFromGeminiProVisionAPI();
        }
      }, [imageUri]);


    const renderItem = ({ item }) => (
    <Text style={styles.itemText}>{item}</Text>
    );

return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.headerTitle}>We are processing your photo...</Text>
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