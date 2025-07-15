import { router } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { fetchRecipes } from "../api/api";
import RecipeCard from "./RecipeCard";
import { UserContext } from "../contexts/UserContext";
import { useFocusEffect } from "@react-navigation/native";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);

  useFocusEffect(
    useCallback(()=>{
      setIsLoading(true);
    fetchRecipes(loggedInUserId)
      .then((result) => {
        console.log("fetching")
        setRecipes(result.recipes);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
      return () => {}
    }, [])
  )


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchRecipes(loggedInUserId)
        .then((result) => {
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
      {isLoading && (
        <View>
          <Modal transparent={true} visible={isLoading} animationType="fade">
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" />
              </View>
            </View>
          </Modal>
        </View>
      )}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 15,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
});

export default RecipeList;
