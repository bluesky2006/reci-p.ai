import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="camera_screen" />
      <Stack.Screen name="response_preview" />
    </Stack>
  );
}
