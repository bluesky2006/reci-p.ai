import { Jura_700Bold } from "@expo-google-fonts/jura/700Bold";
import { useFonts } from "@expo-google-fonts/jura/useFonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RecipeList from "../components/RecipeList";

function HomePage() {
  let [fontsLoaded] = useFonts({
    Jura_700Bold,
  });

  const router = useRouter();
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.homePageContainer}>
        <View style={styles.titleTextBox}>
          <Text style={styles.titleText}>reci-p.ai</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          <AntDesign name="user" size={28} color="white" />
        </TouchableOpacity>
        <RecipeList />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.navigate("/camera_screen")}
          >
            <AntDesign name="pluscircle" size={75} color="#191460" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  homePageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#191460",
  },
  buttonContainer: {
    backgroundColor: "white",
    borderColor: "#191460",
    borderWidth: 0.5,
    borderRadius: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
  },
  button: { bottom: 20 },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: "Jura_700Bold",
  },
  titleTextBox: {
    borderBottomColor: "#191460",
    borderBottomWidth: 0.5,
    padding: 20,
    backgroundColor: "#191460",
  },
  avatar: {
    position: "absolute",
    right: 15,
    top: 90,
  },
});

export default HomePage;
