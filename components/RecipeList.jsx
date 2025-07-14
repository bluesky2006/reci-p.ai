import { router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { fetchRecipes } from "../api/api";
import RecipeCard from "./RecipeCard";
import { UserContext } from "../contexts/UserContext";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);

  useEffect(() => {
    fetchRecipes(loggedInUserId)
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
      fetchRecipes(loggedInUserId)
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
      style={styles.recipeListContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {recipes.toReversed().map((recipe) => (
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
    padding: 15,
    flex: 0,
    flexDirection: "column",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
  },
});

export default RecipeList;
