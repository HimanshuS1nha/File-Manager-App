import { Pressable, Alert } from "react-native";
import React, { useCallback, useMemo } from "react";
import tw from "twrnc";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import ApkInstaller from "@dominicvonk/react-native-apk-installer";
import { unzip } from "react-native-zip-archive";

import ImagePreview from "./image-preview";
import VideoPreview from "./video-preview";
import AudioPreview from "./audio-preview";
import ApkPreview from "./apk-preview";
import PdfPreview from "./pdf-preview";
import ZipPreview from "./zip-preview";
import OtherFilePreview from "./other-file-preview";

import { useSelectedFile } from "@/hooks/use-selected-file";
import { useRecentFiles } from "@/hooks/use-recent-files";
import { useSelectedItems } from "@/hooks/use-selected-items";

import type { FileOrFolderType } from "@/types";

const FilePreview = ({
  file,
  isSelectable = true,
}: {
  file: FileOrFolderType;
  isSelectable?: boolean;
}) => {
  const setSelectedFile = useSelectedFile((state) => state.setSelectedFile);

  const updateRecentFiles = useRecentFiles((state) => state.updateRecentFiles);

  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const updateSelectedItems = useSelectedItems(
    (state) => state.updateSelectedItems
  );

  const isFileSelected = useMemo(
    () => !!selectedItems.find((selectedItem) => selectedItem.id === file.id),
    [selectedItems, file]
  );

  const handleInstallApk = useCallback(() => {
    ApkInstaller.install(file.path).catch(() => {
      Alert.alert("Error in installing the apk");
    });
  }, [file]);

  const handleUnzip = useCallback(() => {
    const folderName = file.name.split(".")[0];
    const folderPath = file.path.replace(file.name, folderName);

    unzip(file.path, folderPath).then(() =>
      router.push({
        pathname: "/folders",
        params: {
          type: folderName,
          path: folderPath,
        },
      })
    );
  }, [file]);

  const handlePress = useCallback(() => {
    if (selectedItems.length > 0) {
      updateSelectedItems(file);
    } else {
      if (file.fileType === "other") {
        Alert.alert("Error", "Unable to open file.");
      } else if (file.fileType === "apk") {
        handleInstallApk();
      } else if (file.fileType === "zip") {
        Alert.alert("Unzip", "Do you want to unzip this file?", [
          {
            text: "No",
          },
          {
            text: "Yes",
            onPress: handleUnzip,
          },
        ]);
      } else {
        setSelectedFile(file);
        updateRecentFiles(file);

        if (file.fileType === "image") {
          router.push("/image-file");
        } else if (file.fileType === "video") {
          router.push("/video-file");
        } else if (file.fileType === "audio") {
          router.push("/audio-file");
        } else if (file.fileType === "pdf") {
          router.push("/pdf-file");
        }
      }
    }
  }, [file, selectedItems]);

  const handleLongPress = useCallback(() => {
    if (isSelectable) {
      updateSelectedItems(file);
    }
  }, [file]);
  return (
    <Pressable
      style={tw`flex-row items-center px-2 py-2 my-0.5 ${
        isFileSelected ? "bg-indigo-100 rounded-lg" : ""
      }`}
      onPress={handlePress}
      onLongPress={handleLongPress}
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

      {isFileSelected ? (
        <AntDesign name="checkcircle" size={20} color="blue" />
      ) : (
        <FontAwesome6 name="ellipsis-vertical" size={20} color="black" />
      )}
    </Pressable>
  );
};

export default FilePreview;
