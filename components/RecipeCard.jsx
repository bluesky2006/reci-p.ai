import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { favouriteRecipe } from "../api/api";
import { router } from "expo-router";

function RecipeCard({_id, title, favourite, image, summary}) {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(()=>{
    setIsFavourite(favourite)
  }, [])
  
  function handleFavourite() {
    if (!isFavourite) {
      setIsFavourite(true);
      favouriteRecipe(_id, true)
    } else {
      setIsFavourite(false);
      favouriteRecipe(_id, false)
    }
  }

  return (
    <View style={[styles.recipeCardContainer, styles.shadowProp]}>
      <Image
        style={styles.recipeThumbnail}
        source={{uri: `data:image/jpeg;base64,${image}`}}
      />
      <View>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.bodyText}>{summary}</Text>
        <TouchableOpacity onPress={handleFavourite}>
          {isFavourite ? (
            <AntDesign name="heart" size={20} color="red" />
          ) : (
            <AntDesign name="hearto" size={20} color="black" />
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
