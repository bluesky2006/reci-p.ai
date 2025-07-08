import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

function ResponsePreview() {
  const { result } = useLocalSearchParams();
  const parsedResponse = JSON.parse(result);
  return <Text>{parsedResponse[0].response}</Text>;
}

export default ResponsePreview;
