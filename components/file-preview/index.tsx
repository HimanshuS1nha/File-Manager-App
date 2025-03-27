import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome6 } from "@expo/vector-icons";

import ImagePreview from "./image-preview";
import VideoPreview from "./video-preview";
import AudioPreview from "./audio-preview";
import ApkPreview from "./apk-preview";
import PdfPreview from "./pdf-preview";
import ZipPreview from "./zip-preview";
import OtherFilePreview from "./other-file-preview";

import type { FileOrFolderType } from "@/types";

const FilePreview = ({ file }: { file: FileOrFolderType }) => {
  return (
    <View style={tw`flex-row items-center px-2 my-2.5`}>
      {file.fileType === "image" ? (
        <ImagePreview file={file} />
      ) : file.fileType === "video" ? (
        <VideoPreview file={file} />
      ) : file.fileType === "audio" ? (
        <AudioPreview file={file} />
      ) : file.fileType === "apk" ? (
        <ApkPreview file={file} />
      ) : file.fileType === "pdf" ? (
        <PdfPreview file={file} />
      ) : file.fileType === "zip" ? (
        <ZipPreview file={file} />
      ) : (
        <OtherFilePreview file={file} />
      )}

      <FontAwesome6 name="ellipsis-vertical" size={20} color="black" />
    </View>
  );
};

export default FilePreview;
