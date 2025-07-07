import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function RecipeCard() {
  const [isFavourite, setIsFavourite] = useState(false);

  function handleFavourite() {
    if (isFavourite === false) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  }

  return (
    <View style={[styles.recipeCardContainer, styles.shadowProp]}>
      <Image
        style={styles.recipeThumbnail}
        source={require("../assets/images/testthumb.png")}
      />
      <View>
        <Text style={styles.recipeTitle}>Square crackers</Text>
        <Text style={styles.bodyText}>Preview recipe text...</Text>
        <TouchableOpacity onPress={handleFavourite}>
          {isFavourite ? (
            <AntDesign name="heart" size={24} color="black" />
          ) : (
            <AntDesign name="hearto" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCardContainer: {
    padding: 10,
    height: 120,
    borderRadius: 5,
    flex: 0,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recipeThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bodyText: {
    marginBottom: 10,
  },
});

export default RecipeCard;
