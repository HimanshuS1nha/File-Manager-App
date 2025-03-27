import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome6 } from "@expo/vector-icons";

import ImagePreview from "./image-preview";

import type { FileOrFolderType } from "@/types";

const FilePreview = ({ file }: { file: FileOrFolderType }) => {
  return (
    <View style={tw`flex-row items-center px-2 my-2.5`}>
      {file.fileType === "image" ? (
        <ImagePreview file={file} />
      ) : (
        // TODO: Handle other files
        <></>
      )}

      <FontAwesome6 name="ellipsis-vertical" size={20} color="black" />
    </View>
  );
};

export default FilePreview;
