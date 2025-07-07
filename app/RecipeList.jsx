import React from "react";
import { StyleSheet, View } from "react-native";
import RecipeCard from "./RecipeCard";

function RecipeList() {
  return (
    <View style={[styles.recipeListContainer, styles.shadowProp]}>
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
      <RecipeCard />
    </View>
  );
}

const styles = StyleSheet.create({
  recipeListContainer: {
    height: "85%",
    padding: 15,
    gap: 15,
    flex: 0,
    flexDirection: "column",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default RecipeList;
