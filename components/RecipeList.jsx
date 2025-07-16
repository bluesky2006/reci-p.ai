import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchRecipes } from "../api/api";
import { UserContext } from "../contexts/UserContext";
import RecipeCard from "./RecipeCard";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterFavourites, setFilterFavourites] = useState(false);
  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchRecipes(loggedInUserId)
        .then((result) => {
          console.log("fetching");
          setRecipes(result.recipes);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {};
    }, [])
  );

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

  function handleFilter() {
    setFilterFavourites(!filterFavourites);
  }

  return (
    <>
      <View style={styles.favContainer}>
        <View style={styles.favTextBox}>
          <Text style={{ fontSize: 14 }}>Toggle favourites</Text>
          {!filterFavourites ? (
            <TouchableOpacity onPress={() => handleFilter()}>
              <FontAwesome name="toggle-off" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleFilter()}>
              <FontAwesome name="toggle-on" size={24} color="#2778fe" />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
                  <ActivityIndicator size="large" color="#2778fe" />
                </View>
              </View>
            </Modal>
          </View>
        )}
        {filterFavourites
          ? recipes.toReversed().map((recipe) =>
              recipe.favourite ? (
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
              ) : (
                ""
              )
            )
          : recipes.toReversed().map((recipe) => (
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
    </>
  );
}

const styles = StyleSheet.create({
  favContainer: {
    backgroundColor: "white",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favTextBox: {
    borderBottomColor: "#efefefff",
    borderBottomWidth: 0.5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10,
  },
  recipeListContainer: {
    padding: 15,
    flex: 0,
    flexDirection: "column",
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
