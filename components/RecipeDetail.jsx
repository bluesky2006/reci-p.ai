import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteRecipe, favouriteRecipe, fetchRecipe } from "../api/api";

const RecipeDetail = () => {
  const { recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchRecipe(recipeId)
      .then((result) => {
        setRecipe(result);
        setIsFavourite(result.favourite);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [recipeId]);

  function handleFavourite() {
    if (!isFavourite) {
      setIsFavourite(true);
      favouriteRecipe(recipeId, true);
    } else {
      setIsFavourite(false);
      favouriteRecipe(recipeId, false);
    }
  }

  function handleDelete() {
    deleteRecipe(recipeId)
      .then(() => {
        router.back();
      })
      .catch((err) => {
        console.log(err);
        return <Text>Failed to delete</Text>;
      });
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Image
        style={styles.recipeImage}
        source={{ uri: `data:image/jpeg;base64,${recipe.image}` }}
      />
      <TouchableOpacity onPress={handleFavourite}>
        {isFavourite ? (
          <AntDesign name="heart" size={20} color="red" />
        ) : (
          <AntDesign name="hearto" size={20} color="black" />
        )}
      </TouchableOpacity>
      <Text>{recipe.title}</Text>
      <Text style={{ fontWeight: "bold" }}>Ingredients</Text>
      {recipe.ingredients?.map((ingredient, index) => {
        return <Text key={ingredient + index}>{ingredient}</Text>;
      })}
      <Text style={{ fontWeight: "bold" }}>Steps</Text>
      {recipe.steps?.map((step, index) => {
        return (
          <Text key={step + index}>
            Step {index + 1}. {step}
          </Text>
        );
      })}
      <Button onPress={handleDelete} title="Delete recipe" />
      <Button onPress={() => router.back()} title="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  recipeImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
});

export default RecipeDetail;
