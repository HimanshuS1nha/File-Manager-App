import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import Pdf from "react-native-pdf";
import { Stack } from "expo-router";

import { useSelectedFile } from "@/hooks/use-selected-file";

const PdfFile = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title: selectedFile!.name,
          headerBackVisible: true,
          statusBarBackgroundColor: "#fff",
          statusBarStyle: "dark",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <Pdf source={{ uri: selectedFile!.uri }} style={tw`flex-1`} />
    </View>
  );
};

export default PdfFile;
