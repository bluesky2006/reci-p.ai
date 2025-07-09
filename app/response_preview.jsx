import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

function ResponsePreview() {
  const { result, photo } = useLocalSearchParams();
  const parsedResponse = JSON.parse(result);
  console.log(photo);

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{ uri: photo }}
        />
      </View>
      <View>
        <Text>{parsedResponse[0].response}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 100, width: 100 },
});

export default ResponsePreview;
