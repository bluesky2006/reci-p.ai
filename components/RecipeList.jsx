import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { fetchRecipes } from "../api/api";
import RecipeCard from "./RecipeCard";
import { router } from "expo-router";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes("686e88d55f1d85970d4d3ab4")
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
        <Pressable key={recipe._id} onPress={()=>router.navigate('/recipe_detail')}>
          <RecipeCard
            title={recipe.title}
            favourite={recipe.favourite}
            _id={recipe._id}
            image={recipe.image}
            summary={recipe.summary}
          />
        </Pressable>
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
