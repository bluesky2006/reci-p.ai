import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
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
    onChangeTitleText(title);
  }

  function handleSubmit() {
    editRecipeTitle(recipeId, titleText)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditing(false);
        setTitle(titleText);
      });
  }

  function handleCancelEdit() {
    setIsEditing(false);
    onChangeTitleText(recipe.title);
  }

  if (isLoading) {
    return (
      <View>
        <Modal transparent={true} visible={isLoading} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#2778fe" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#efefefff" }}>
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="fade"
      >
        <View
          style={{
            backgroundColor: "#00000022",
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
        ></View>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Delete recipe?</Text>
            <Text style={styles.modalText}>
              This will permanently delete this recipe from your account.
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 75,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDeleteModalVisible(false);
                }}
              >
                <Text
                  style={{
                    color: "#00000082",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDelete();
                }}
              >
                <Text
                  style={{
                    color: "#2778fe",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={discardModalVisible}
        animationType="fade"
      >
        <View
          style={{
            backgroundColor: "#00000022",
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
        ></View>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Leave this page?</Text>
            <Text style={styles.modalText}>
              Doing so will discard your unsaved changes.
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDiscardModalVisible(false);
                }}
              >
                <Text
                  style={{
                    color: "#00000082",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Text
                  style={{
                    color: "#2778fe",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.titleTextBox}
        onPress={() =>
          isEditing ? setDiscardModalVisible(true) : router.back()
        }
      >
        <AntDesign name="arrowleft" size={24} color="#2778fe" />
      </TouchableOpacity>
      <ScrollView style={styles.pageContainer}>
        <View style={styles.titleContainer}>
          <Image
            style={styles.recipeThumbnail}
            source={{ uri: `data:image/jpeg;base64,${recipe.image}` }}
          />
          <View style={styles.textBoxCard}>
            {isEditing ? (
              <TextInput
                onChangeText={onChangeTitleText}
                value={titleText}
                style={styles.recipeTitleInput}
                autoFocus={true}
                maxLength={40}
                numberOfLines={2}
                multiline={true}
              />
            ) : (
              <Text style={styles.recipeTitle}>{title}</Text>
            )}
            {isEditing ? (
              <View style={styles.editIcons}>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <FontAwesome name="close" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit}>
                  <FontAwesome name="check" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.mainIcons}>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(true);
                  }}
                  disabled={isDeleting}
                >
                  <FontAwesome name="trash" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} disabled={isDeleting}>
                  <FontAwesome name="pencil" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFavourite}>
                  {isFavourite ? (
                    <AntDesign name="heart" size={20} color="red" />
                  ) : (
                    <AntDesign name="hearto" size={20} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "#d7d7d7ff",
            borderBottomWidth: 1,
            marginVertical: 8,
            marginBottom: 14,
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
        <View
          style={{
            borderBottomColor: "#d7d7d7ff",
            borderBottomWidth: 1,
            marginVertical: 13,
          }}
        />
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
    borderColor: "#efefefff",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "white",
  },
  titleTextBox: {
    borderBottomColor: "#efefefff",
    borderBottomWidth: 0.5,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#efefefff",
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
  recipeTitleInput: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 0
  },
  textBoxCard: { flexShrink: 1, width: "100%" },
  mainIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  editIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  bodyText: { marginVertical: 5, lineHeight: 20, fontSize: 16 },
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
    shadowColor: "#5d5d5dff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  modalButtons: {
    backgroundColor: "white",
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
});

export default RecipeDetail;
