import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

function ResponsePreview() {
  const { result, photo } = useLocalSearchParams();
  const parsedResponse = JSON.parse(result);
  const { title, ingredients, steps } = parsedResponse[0];

  // console.log(title);
  console.log(ingredients);
  // console.log(steps);

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{ uri: photo }}
        />
      </View>
      <View>
        <Text>{title}</Text>
        <Text>{ingredients}</Text>
        <Text>{steps}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 100, width: 100 },
});

export default ResponsePreview;
