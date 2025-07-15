import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteRecipe, favouriteRecipe, fetchRecipe } from "../api/api";

const RecipeDetail = () => {
  const { recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    deleteRecipe(recipeId)
      .then(() => {
        router.back();
      })
      .catch((err) => {
        console.log(err);
        return <Text>Failed to delete</Text>;
      })
      .finally(() => {
        setIsDeleting(false);
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
    <SafeAreaView style={{ backgroundColor: "#191460" }}>
      <TouchableOpacity
        style={styles.titleTextBox}
        onPress={() => router.back()}
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView style={styles.pageContainer}>
        <View style={styles.titleContainer}>
          <Image
            style={styles.recipeThumbnail}
            source={{ uri: `data:image/jpeg;base64,${recipe.image}` }}
          />
          <View style={styles.textBoxCard}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.faveDelete}>
              <View></View>
              <TouchableOpacity onPress={handleFavourite}>
                {isFavourite ? (
                  <AntDesign name="heart" size={20} color="red" />
                ) : (
                  <AntDesign name="hearto" size={20} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
            marginVertical: 5,
          }}
        />
        <Text style={styles.heading}>Ingredients</Text>
        {recipe.ingredients?.map((ingredient, index) => {
          return (
            <Text key={ingredient + index} style={styles.bodyText}>
              • {ingredient}
            </Text>
          );
        })}
        <Text style={styles.heading}>Steps</Text>
        {recipe.steps?.map((step, index) => {
          return (
            <Text key={step + index} style={styles.bodyText}>
              {index + 1}. {step}
            </Text>
          );
        })}
        <View style={{ height: 40 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    borderColor: "#191460",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "white",
    marginBottom: 30,
  },
  titleTextBox: {
    borderBottomColor: "#191460",
    borderBottomWidth: 0.5,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#191460",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "top",
    marginBottom: 10,
  },
  recipeThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  textBoxCard: { flexShrink: 1 },
  faveDelete: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  bodyText: { marginVertical: 5, lineHeight: 18 },
});

export default RecipeDetail;
