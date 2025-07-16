import { Jura_700Bold, useFonts } from "@expo-google-fonts/jura";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeList from "../components/RecipeList";
import { FontAwesome } from "@expo/vector-icons";

function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(GoogleSignin.getCurrentUser());
  }, []);

  let [fontsLoaded] = useFonts({
    Jura_700Bold,
  });

  const router = useRouter();
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.homePageContainer}>
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={require("../assets/logo.png")}
              style={{ height: 40, width: 40 }}
            />
            <Text style={styles.titleText}>reci-p.ai</Text>
          </View>
          <TouchableOpacity onPress={() => router.navigate("/profile")}>
            {user.user.photo ? (
              <Image source={{ uri: user.user.photo }} style={styles.image} />
            ) : (
              <Image source={require("../assets/avatar-placeholder.png")} style={styles.image} />
            )}
          </TouchableOpacity>
        </View>
        <RecipeList />
        <View style={styles.buttonContainer}>
          <View style={[styles.shutterBtnBg]}></View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.navigate("/camera_screen")}
          >
            <AntDesign name="pluscircle" size={75} color="#2778fe" />
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
  },
  buttonContainer: {
    backgroundColor: "#efefefff",
    borderColor: "#efefefff",
    borderWidth: 0.5,
    borderRadius: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  button: { bottom: 20 },
  titleText: {
    fontSize: 30,
    textAlign: "center",
    color: "#2778fe",
    fontFamily: "Jura_700Bold",
  },
  titleContainer: {
    height: 100,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderColor: "#2778fe",
    borderWidth: 2,
  },
  shutterBtnBg: {
    position: "absolute",
    backgroundColor: "#efefefff",
    width: 75,
    height: 75,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    bottom: 63.7,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
});

export default HomePage;
