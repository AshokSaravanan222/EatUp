import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import NearbyJobCard from "./NearbyJobCard";

import styles from "./nearbyjobs.style";
import { COLORS } from "../../constants";

import axios from "axios";

const uuid = "af7c1fe6-d669-414e-b066-e9733f0de7a8"

const Nearbyjobs = ({data}) => {

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
    
    // const getInfo = async () => {
    //     try {
    //       setLoading(true);
    //       const response = await axios.post('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/data', {
    //         uuid: uuid,
    //       });
    //       console.log(response.data); // Handle the response as needed
    //       setData(response.data);
    //       setLoading(false);
    //     } catch (error) {
    //       console.error('Error posting data:', error);
    //     }
    //   };
    
    //   useEffect(() => {
    //     getInfo()
    //   }, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bag of Ruffles Chips</Text>  
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong </Text>
        ) : (
          data.map((ingredient) => (
            <NearbyJobCard
            ingredient={ingredient}
            />
          ))
        )}
      </View>
      
    </View>
  );
};

export default Nearbyjobs;
