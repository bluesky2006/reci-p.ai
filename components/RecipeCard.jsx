import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { favouriteRecipe } from "../api/api";

function RecipeCard({ _id, title, favourite, image, summary }) {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    setIsFavourite(favourite);
  }, [favourite]);

  function handleFavourite() {
    if (!isFavourite) {
      setIsFavourite(true);
      favouriteRecipe(_id, true);
    } else {
      setIsFavourite(false);
      favouriteRecipe(_id, false);
    }
  }

  return (
    <View style={[styles.recipeCardContainer, styles.shadowProp]}>
      <Image
        style={styles.recipeThumbnail}
        source={{ uri: `data:image/jpeg;base64,${image}` }}
      />
      <View style={styles.textBoxCard}>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.bodyText}>{summary}</Text>
      </View>
      <TouchableOpacity
        onPress={handleFavourite}
        style={{ position: "absolute", bottom: 10, right: 10 }}
      >
        {isFavourite ? (
          <AntDesign name="heart" size={20} color="red" />
        ) : (
          <AntDesign name="hearto" size={20} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCardContainer: {
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    gap: 10,
    alignItems: "top",
    backgroundColor: "white",
    marginBottom: 15,
  },
  shadowProp: {
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  recipeThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bodyText: {
    marginBottom: 10,
  },
  textBoxCard: { flexShrink: 1, paddingTop: 10 },
});

export default RecipeCard;
