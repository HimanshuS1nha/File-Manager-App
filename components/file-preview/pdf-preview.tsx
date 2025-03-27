import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { formatDistanceToNowStrict } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatFileSize } from "@/utils/format-file-size";

import type { FileOrFolderType } from "@/types";

const PdfPreview = ({ file }: { file: FileOrFolderType }) => {
  return (
    <View style={tw`flex-row gap-x-3 items-center flex-1`}>
      <View
        style={tw`border border-gray-300 rounded-md size-12 items-center justify-center`}
      >
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={32}
          color={"#E11D48"}
        />
      </View>

      <View style={tw`gap-y-1.5`}>
        <Text style={tw`font-medium text-base`}>
          {file.name.length > 30
            ? file.name.substring(0, 30) + "..."
            : file.name}
        </Text>
        <Text style={tw`text-gray-700`}>
          {formatFileSize(file.size)},{" "}
          {formatDistanceToNowStrict(file.modificationTime)} ago
        </Text>
      </View>
    </View>
  );
};

export default PdfPreview;
