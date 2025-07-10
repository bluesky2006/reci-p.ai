import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { fetchRecipes } from "../api/api";
import RecipeCard from "./RecipeCard";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecipes("686fa2589d7db59316900d39")
      .then((result) => {
        setRecipes(result.recipes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [recipes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchRecipes("686fa2589d7db59316900d39")
        .then((result) => {
          console.log(result.recipes[0].favourite, "asdasdf");
          setRecipes(result.recipes);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setRefreshing(false);
        });
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={[styles.recipeListContainer, styles.shadowProp]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {recipes.map((recipe) => (
        <Pressable
          key={recipe._id}
          onPress={() =>
            router.navigate({
              pathname: "/recipe_detail",
              params: { recipeId: recipe._id },
            })
          }
        >
          <RecipeCard
            title={recipe.title}
            favourite={recipe.favourite}
            _id={recipe._id}
            image={recipe.image}
            summary={recipe.summary}
          />
        </Pressable>
      ))}
    </ScrollView>
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
