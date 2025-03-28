import { Pressable, View } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

import ImagePreview from "./image-preview";
import VideoPreview from "./video-preview";
import AudioPreview from "./audio-preview";
import ApkPreview from "./apk-preview";
import PdfPreview from "./pdf-preview";
import ZipPreview from "./zip-preview";
import OtherFilePreview from "./other-file-preview";

import { useSelectedFile } from "@/hooks/use-selected-file";

import type { FileOrFolderType } from "@/types";

const FilePreview = ({ file }: { file: FileOrFolderType }) => {
  const setSelectedFile = useSelectedFile((state) => state.setSelectedFile);

  const handlePress = useCallback(() => {
    if (file.fileType === "apk") {
      // TODO: Initiate installation
    } else if (file.fileType === "zip") {
      // TODO: Initiate unzipping
    } else {
      setSelectedFile(file);

      if (file.fileType === "image") {
        router.push("/image-file");
      } else if (file.fileType === "video") {
        router.push("/video-file");
      } else if (file.fileType === "audio") {
        router.push("/audio-file");
      }
    }
  }, [file]);
  return (
    <Pressable
      style={tw`flex-row items-center px-2 my-2.5`}
      onPress={handlePress}
    >
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
    </Pressable>
  );
};

export default FilePreview;
