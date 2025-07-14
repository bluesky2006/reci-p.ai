import { Stack } from "expo-router";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="recipe_detail" />
        <Stack.Screen name="camera_screen" />
        <Stack.Screen name="image_picker" />
        <Stack.Screen name="response_preview" />
      </Stack>
    </UserProvider>
  );
}
