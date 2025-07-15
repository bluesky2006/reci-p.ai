import { Jura_700Bold, useFonts } from "@expo-google-fonts/jura";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeList from "../components/RecipeList";
import { useEffect, useState } from "react";

function HomePage() {
  const [user, setUser] = useState(null)
  
  useEffect(()=>{
    setUser(GoogleSignin.getCurrentUser())
  }, [])

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
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.navigate("/profile")}
        >
          <Image
            source={{ uri: user.user.photo }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              borderColor: "white",
              borderWidth: 2,
            }}
          />
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
    height: 120,
  },
  button: { bottom: 20 },
  titleText: {
    fontSize: 32,
    textAlign: "center",
    color: "white",
    fontFamily: "Jura_700Bold",
  },
  titleTextBox: {
    borderBottomColor: "#191460",
    borderBottomWidth: 0.5,
    padding: 30,
    backgroundColor: "#191460",
    height: 100,
  },
  avatar: {
    position: "absolute",
    right: 15,
    top: 90,
  },
});

export default HomePage;
