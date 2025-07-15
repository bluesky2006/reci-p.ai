import FontAwesome from "@expo/vector-icons/FontAwesome";
// import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { postRecipe } from "../api/api";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

function ResponsePreview() {
  const { result, photo } = useLocalSearchParams();
  const router = useRouter();
  const parsedResponse = JSON.parse(result);
  const { title, ingredients, steps, summary } = parsedResponse[0];
  const { loggedInUserId, setLoggedInUserId } = useContext(UserContext);
  const [isDisabled, setIsDisabled] = useState(false)
  

  function handleSaveRecipe() {
    setIsDisabled(true)
    return postRecipe(
      loggedInUserId,
      title,
      ingredients,
      steps,
      photo,
      summary
    )
      .then(() => {
        router.dismissTo('/home');
      })
      .catch((error) => {
        console.log(error, "<<postRecipe");
      }).finally(()=>{
        setIsDisabled(false)
      })
  }

  return (
    <SafeAreaView style={styles.responseContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{ uri: `data:image/jpeg;base64,${photo}` }}
        />
      </View>
      <ScrollView style={styles.sectionListContainer}>
        <Text style={styles.listHeader}>{title}</Text>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredients}>
              • {ingredient}
            </Text>
          ))}
        </View>
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Text key={index} style={styles.steps}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.previewButtonContainer}>
        <TouchableOpacity onPress={() => router.dismiss(2)} disabled={isDisabled}>
          <FontAwesome name="close" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveRecipe} disabled={isDisabled}>
          <FontAwesome name="check" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  responseContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 15,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    height: "45%",
    padding: 10,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
  sectionListContainer: {
    height: "40%",
    backgroundColor: "#ffffff",
    padding: 15,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  listHeader: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
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
    marginVertical: 10,
    borderRadius: 5,
  },
  steps: { fontSize: 14, marginVertical: 5 },
  stepsContainer: {},
  previewButtonContainer: {
    height: "10%",
    marginTop: 10,
    backgroundColor: "#ffffff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 75,
    padding: 20,
  },
});

export default ResponsePreview;
