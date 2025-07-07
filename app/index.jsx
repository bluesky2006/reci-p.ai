import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import RecipeList from "../components/RecipeList";
import { useRouter } from "expo-router";
// import CameraView from "./CameraView"

function HomePage() {
  const router = useRouter()
  return (
    <View style={styles.homePageContainer}>
      <RecipeList />
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.navigate('/camera')}>
        <AntDesign
          name="pluscircle"
          size={60}
          color="black"
          style={styles.button}
        />
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  homePageContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    backgroundColor: "white",
  },
  buttonContainer: {
    marginVertical: "auto",
    alignItems: "center",
  },
});

export default HomePage;
