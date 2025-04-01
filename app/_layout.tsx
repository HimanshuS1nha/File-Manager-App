import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          statusBarStyle: "dark",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            statusBarBackgroundColor: "#4F46E5",
            statusBarStyle: "light",
          }}
        />

        <Stack.Screen
          name="home"
          options={{
            title: "File Manager",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="move-or-copy"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerBackVisible: false,
            headerShadowVisible: false,
            headerShown: true,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
