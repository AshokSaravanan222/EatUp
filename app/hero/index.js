import React from 'react'
import { SafeAreaView, StyleSheet, View} from 'react-native'
import * as SecureStore from 'expo-secure-store';
import { Slide, HeroButton} from '../../components';
import Swiper from 'react-native-swiper';

import { SIZES } from '../../constants';
import { router } from 'expo-router';

const Hero = () => {

    return (
        <SafeAreaView style={styles.parent}>
            <View
                style={styles.container}
            >
                <Swiper style={styles.wrapper} showsButtons={false}>
                    <Slide style={styles.slide1}
                        heading={"We know that self-improvement is hard."}
                        lottieFile={require("./../../assets/lottie/meditation.json")}
                        description={"Let our AI tools do the dirty work -- while you read the most optimal books."}
                    />
                    <Slide style={styles.slide2}
                        heading={"Find the answers you have been looking for."}
                        lottieFile={require("./../../assets/lottie/read.json")}
                        description={"With hundreds of books to choose from, ReadAI can find the ones necessary for your journey."}
                    />
                    <Slide style={styles.slide3}
                        heading={"No shortcuts."}
                        lottieFile={require("./../../assets/lottie/weight.json")}
                        description={"We know that nothing worth it comes easy: our goal is to reduce that friction. Just 27 questions to find your next life-changing book."}
                    />
                </Swiper>
                <HeroButton onPress={router.push("home")} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    container: {
        flex: 1,
        padding: SIZES.medium,
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    }
})

export default Hero;