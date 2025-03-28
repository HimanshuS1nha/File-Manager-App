import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          statusBarStyle: "dark",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "#4F46E5",
            statusBarStyle: "light",
          }}
        />

        <Stack.Screen
          name="home"
          options={{
            title: "File Manager",
          }}
        />

        <Stack.Screen name="favourites" options={{ title: "Favourites" }} />
      </Stack>
    </QueryClientProvider>
  );
}
