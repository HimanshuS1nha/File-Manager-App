import { Stack } from "expo-router";

const FoldersLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="internal-storage"
        options={{
          title: "Internal Storage",
        }}
      />
    </Stack>
  );
};

export default FoldersLayout;
