import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="todolist" />
      <Stack.Screen name="CreateTask" />
      <Stack.Screen name="UpdateTask" />
      <Stack.Screen name="taskdetail" />
    </Stack>
  );
}
