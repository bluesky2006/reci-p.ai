import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteRecipe,
  editRecipeTitle,
  favouriteRecipe,
  fetchRecipe,
} from "../api/api";

const RecipeDetail = () => {
  const { recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false)
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [titleText, onChangeTitleText] = useState("placeholder");
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchRecipe(recipeId)
      .then((result) => {
        setRecipe(result);
        setTitle(result.title);
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
    setDeleteModalVisible(false);
    setIsDeleting(true);
    deleteRecipe(recipeId)
      .then(() => {
        router.back();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  function handleEdit() {
    setIsEditing(true);
    onChangeTitleText(recipe.title);
  }

  function handleSubmit() {
    editRecipeTitle(recipeId, titleText)
      .then((res) => {console.log(res)})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditing(false); //consider setTitle within this function, using the state to draw our title in return + having it as a re-fetch dependency or similar
        setTitle(titleText)
      });
  }

  function handleCancelEdit() {
    setIsEditing(false)
    onChangeTitleText(recipe.title)
  }

  if (isLoading) {
    return (
      <View>
        <Modal transparent={true} visible={isLoading} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  

  return (
    <SafeAreaView style={{ backgroundColor: "#191460" }}>
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="fade"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginVertical: 15, fontSize: 18 }}>
              Are you sure you want to delete?
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 50,
              }}
            >
              <Button
                style={styles.modalButtons}
                onPress={() => {
                  setDeleteModalVisible(false);
                }}
                title="Cancel"
                color="#00000082"
              />
              <Button
                style={styles.modalButtons}
                onPress={() => {
                  handleDelete();
                }}
                title="Delete"
                color="#ff0000ff"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={discardModalVisible}
        animationType="fade"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginVertical: 15, fontSize: 18 }}>
              Discard changes?
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 50,
              }}
            >
              <Button
                style={styles.modalButtons}
                onPress={() => {
                  setDiscardModalVisible(false);
                }}
                title="Cancel"
                color="#00000082"
              />
              <Button
                style={styles.modalButtons}
                onPress={() => { router.back()
                }}
                title="Discard"
                color="#ff0000ff"
              />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.titleTextBox}
        onPress={() => isEditing ? setDiscardModalVisible(true) : router.back()}
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
            {isEditing ? (
              <TextInput onChangeText={onChangeTitleText} value={titleText} />
            ) : (
              <Text style={styles.recipeTitle}>{title}</Text>
            )}
            <View style={styles.faveDelete}>
              <View></View>
              <TouchableOpacity onPress={handleFavourite}>
                {isFavourite ? (
                  <AntDesign name="heart" size={20} color="red" />
                ) : (
                  <AntDesign name="hearto" size={20} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit} disabled={isDeleting}>
                <FontAwesome name="pencil" size={24} color="black" />
              </TouchableOpacity>
              {isEditing && (
                <>
                  <TouchableOpacity onPress={handleSubmit}>
                    <FontAwesome name="check" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelEdit}>
                    <FontAwesome name="close" size={24} color="black" />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                onPress={() => {
                  setDeleteModalVisible(true);
                }}
                disabled={isDeleting}
              >
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
        <View style={{ height: 100 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: "100%",
    borderColor: "#191460",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "white",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#191460",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalButtons: {
    fontSize: 10,
    backgroundColor: "white",
    padding: 10,
  },
});

export default RecipeDetail;
