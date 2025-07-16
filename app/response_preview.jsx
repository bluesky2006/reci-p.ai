import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postRecipe } from "../api/api";
import { UserContext } from "../contexts/UserContext";

function ResponsePreview() {
  const { result, photo } = useLocalSearchParams();
  const router = useRouter();
  const parsedResponse = JSON.parse(result);
  const { title, ingredients, steps, summary } = parsedResponse[0];
  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);
  const [isDisabled, setIsDisabled] = useState(false);

  function handleSaveRecipe() {
    setIsDisabled(true);
    return postRecipe(loggedInUserId, title, ingredients, steps, photo, summary)
      .then(() => {
        router.dismissTo("/home");
      })
      .catch((error) => {
        console.log(error, "<<postRecipe");
      })
      .finally(() => {
        setIsDisabled(false);
      });
  }

  return (
    <SafeAreaView style={styles.responseContainer}>
      <View
        style={{
          height: 15,
          justifyContent: "center",
        }}
      ></View>
      <View style={styles.recipePreviewContainer}>
        <View style={styles.recipePreviewTextBox}>
          <Text style={styles.recipePreviewText}>Recipe preview</Text>
        </View>
      </View>
      <ScrollView style={styles.sectionListContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 15,
            borderBottomColor: "#d7d7d7ff",
            borderBottomWidth: 1,
            marginBottom: 10,
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageThumbnail}
              source={{ uri: `data:image/jpeg;base64,${photo}` }}
            />
          </View>
          <Text style={styles.listHeader}>{title}</Text>
        </View>
        <Text style={styles.heading}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.bodyText}>
              • {ingredient}
            </Text>
          ))}
        </View>
        <View
          style={{
            borderBottomColor: "#d7d7d7ff",
            borderBottomWidth: 1,
            marginVertical: 13,
          }}
        />
        <Text style={styles.heading}>Steps</Text>
        {steps.map((step, index) => (
          <Text key={index} style={styles.bodyText}>
            {index + 1}. {step}
          </Text>
        ))}
        <View style={{ height: 100 }}></View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => router.dismiss(2)}
            disabled={isDisabled}
          >
            <AntDesign name="close" size={40} color="#2778fe" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveRecipe} disabled={isDisabled}>
            <AntDesign name="check" size={40} color="#2778fe" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  responseContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#efefefff",
  },
  imageContainer: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  imageThumbnail: { height: 100, width: 100, borderRadius: 5 },
  sectionListContainer: {
    height: "40%",
    backgroundColor: "#ffffff",
    padding: 15,
  },
  listHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    flexShrink: 1,
  },
  listHeaderContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  ingredients: {
    fontSize: 16,
    fontWeight: "condensedBold",
    marginVertical: 5,
  },
  ingredientsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  steps: { fontSize: 14, marginVertical: 5 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#efefefff",
    alignItems: "center",
    position: "absolute",
    borderRadius: 15,
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  bodyText: { marginVertical: 5, lineHeight: 20, fontSize: 16 },
  recipePreviewText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: 600,
    color: "#2778fe",
  },
  recipePreviewTextBox: {
    padding: 10,
    borderBottomColor: "#d7d7d7ff",
    borderBottomWidth: 1,
  },
  recipePreviewContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "white",
  },
});

export default ResponsePreview;
