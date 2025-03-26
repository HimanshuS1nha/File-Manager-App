import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

import type { FileOrFolderType } from "@/types";

const FolderPreview = ({ folder }: { folder: FileOrFolderType }) => {
  return (
    <View style={tw`flex-row gap-x-5 items-center px-2 py-2.5`}>
      <FontAwesome name="folder" size={42} color="#4F46E5" />

      <Text style={tw`font-medium text-base`}>
        {folder.name.length > 30
          ? folder.name.substring(0, 30) + "..."
          : folder.name}
      </Text>
    </View>
  );
};

export default FolderPreview;
