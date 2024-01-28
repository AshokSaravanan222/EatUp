import { Redirect} from "expo-router";
import { StyleSheet, View } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Redirect href="/home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});