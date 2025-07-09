import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { fetchRecipes } from "../api/api";
import RecipeCard from "./RecipeCard";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes("686d32e3cc16d4d33d6d0e62")
      .then((result) => {
        setRecipes(result.recipes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View style={[styles.recipeListContainer, styles.shadowProp]}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          title={recipe.title}
          favourite={recipe.favourite}
          _id={recipe._id}
        />
      ))}
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
