import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { formatDistanceToNowStrict } from "date-fns";

import { formatFileSize } from "@/utils/format-file-size";

import type { FileOrFolderType } from "@/types";

const ImagePreview = ({ file }: { file: FileOrFolderType }) => {
  return (
    <View style={tw`flex-row gap-x-3 items-center flex-1`}>
      <View style={tw`size-12`}>
        <Image source={{ uri: file.uri }} style={tw`size-full rounded-lg`} />
      </View>
      <View style={tw`gap-y-1`}>
        <Text style={tw`capitalize font-medium text-base`}>
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

export default ImagePreview;
