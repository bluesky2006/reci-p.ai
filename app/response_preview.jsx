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
        style={{ marginVertical: 15, height: 50, justifyContent: "center" }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: 600,
            textAlign: "center",
            color: "#2778fe",
          }}
        >
          Recipe preview
        </Text>
      </View>
      <ScrollView style={styles.sectionListContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 15,
            borderBottomColor: "#efefefff",
            borderBottomWidth: 0.5,
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
        <View>
          <Text style={styles.heading}>Steps</Text>
          {steps.map((step, index) => (
            <Text key={index} style={styles.bodyText}>
              {index + 1}. {step}
            </Text>
          ))}
          <View style={{ height: 100 }}></View>
        </View>
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
    borderRadius: 15,
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
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  bodyText: { marginVertical: 5, lineHeight: 18 },
});

export default ResponsePreview;
