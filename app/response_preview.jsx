import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

function ResponsePreview() {
  const { result, photo } = useLocalSearchParams();
  console.log(result);

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: "100%", width: "100%" }}
          source={{ uri: photo }}
        />
      </View>
      <View>
        <Text>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 100, width: 100 },
});

export default ResponsePreview;
