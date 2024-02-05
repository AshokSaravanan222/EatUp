import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, SafeAreaView} from "react-native";
import { useState, useRef, useEffect } from "react";

import TextTicker from "react-native-text-ticker";
import { COLORS, SIZES, FONT } from "../../constants";
import { Date, CameraButton } from "../../components";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import axios from 'axios';


const Page = () => {

  const router = useRouter();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [title, setTitle] = useState(""); // State for the animated title
  const titleRef = useRef(null);

  const formatDate = (dateStr) => {
    const [month, day, year] = dateStr.split("-").map(Number);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedDate = `${months[month - 1]} ${day}, 20${year}`;
    return formattedDate;
  };

  const fetchLocalData = async (key) => {
    try {
      const jsonData = await SecureStore.getItemAsync(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error("Error fetching data from SecureStore", error);
      return null;
    }
  }

  const saveLocalData = async (key, data) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(data));
      console.log(JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to SecureStore", error);
    }
  }

  const onCameraBtnPress = () => {
    fetchLocalData("uuid")
      .then((uuidv4) => {
        if (uuidv4 == null) {
          console.log("null uuid")
          return
        } else {
          router.push({ pathname: 'home/camera', params: { uuid: uuidv4 } });
        }
      })
  }

  async function getData(uuidv4) {
    setLoading(true);
    try {

      // Make the API call
      const response = await axios.get('https://xs1grhmjqd.execute-api.us-east-2.amazonaws.com/default/user', {
        headers: {
          uuid: uuidv4
        }
      });

      // Log and handle the response as needed
      console.log(response.data);
      setData(response.data)

    } catch (error) {
      // Log the error and extract the specific message if available
      console.error('Error getting data:', error.response ? error.response.data : error);
      setError(true); // Set error state
    } finally {
      setLoading(false); // Ensure loading is false after operation completes or fails

    }
  }

  useEffect(() => {
    fetchLocalData("uuid")
      .then((uuidv4) => {
        if (uuidv4 == null) {
          saveLocalData("uuid", uuid.v4())
        } else {
          getData(uuidv4);
        }
      })
  }, []);

  useEffect(() => {
    // Simulate a typing animation by updating the title character by character
    const targetTitle = "EatUp";
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < targetTitle.length) {
        setTitle(targetTitle.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 200); // Adjust the typing speed as needed
    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View
        style={{
          flex: 1,
          padding: SIZES.medium,
          paddingBottom: 90, // Add padding to create space for the button
        }}
      >
        <View style={styles.container}>
          <View style={styles.cardsContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : error ? (
              <Text>Something went wrong</Text>
            ) : (
              <View>
                <FlatList
                  data={data.items}
                  renderItem={({ item }) => (
                    <Date date={formatDate(item.date)} data={item.meals} />
                  )}
                  keyExtractor={(item) => item.date}
                  contentContainerStyle={{ columnGap: SIZES.medium }}
                  vertical
                  ListHeaderComponent={
                    <View>
                      <TextTicker
                        ref={titleRef}
                        style={{
                          fontFamily: FONT.bold,
                          fontSize: 100,
                          color: COLORS.primary,
                        }}
                        duration={4000} // Adjust the duration for animation speed
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}
                      >
                        {title}
                      </TextTicker>
                      <Image
                        source={require("../../assets/food.jpg")}
                        resizeMode="cover"
                        style={{
                          width: 300,
                          height: 300,
                          borderRadius: 20,
                        }}
                      />
                    </View>
                  }
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.cameraButtonContainer}>
        <CameraButton
          onPress={onCameraBtnPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.medium,
    backgroundColor: "transparent",
  }
});

export default Page;