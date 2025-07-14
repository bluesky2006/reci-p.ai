import { Stack } from "expo-router";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="home" />
      <Stack.Screen
        name="recipe_detail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="camera_screen"
        // options={{
        //   headerShown: false,
        // }}
      />
      <Stack.Screen
        name="image_picker"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="response_preview"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
</UserProvider>
  );
}
