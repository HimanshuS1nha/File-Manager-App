import { View, Text, Modal, Pressable, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlink } from "react-native-fs";
import { router } from "expo-router";

import { useFileDropdown } from "@/hooks/use-file-dropdown";
import { useSelectedFile } from "@/hooks/use-selected-file";
import { useFavourites } from "@/hooks/use-favourites";
import { useRecentFiles } from "@/hooks/use-recent-files";

const FileDropdown = () => {
  const queryClient = useQueryClient();

  const { isVisible, setIsVisible } = useFileDropdown();

  const { selectedFile, setSelectedFile } = useSelectedFile();

  const favourites = useFavourites((state) => state.favourites);
  const updateFavourites = useFavourites((state) => state.updateFavourites);
  const doesFavouritesContain = useFavourites((state) => state.contains);

  const recentFiles = useRecentFiles((state) => state.recentFiles);
  const removeFromRecentFiles = useRecentFiles(
    (state) => state.removeFromRecentFiles
  );
  const doesRecentFilesContain = useRecentFiles((state) => state.contains);

  const { mutate: handleDeleteSelectedFile, isPending } = useMutation({
    mutationKey: ["delete-selected-file"],
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error("No file selected.");
      }

      await unlink(selectedFile.path);

      if (doesFavouritesContain(selectedFile)) {
        updateFavourites(selectedFile);
      }

      if (doesRecentFilesContain(selectedFile)) {
        removeFromRecentFiles(selectedFile);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      setIsVisible(false);
      setSelectedFile(null);
      router.back();
    },
  });
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
    >
      <Pressable style={tw`flex-1`} onPress={() => setIsVisible(false)}>
        <View
          style={tw`absolute right-2 top-[6%] bg-gray-800 shadow-lg shadow-white p-4 rounded-lg justify-center w-[40%] gap-y-5`}
        >
          <Pressable>
            <Text style={tw`text-white text-base`}>Info</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert("Warning", "Do you want to delete this file?", [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: () => handleDeleteSelectedFile(),
                },
              ]);
            }}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base`}>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FileDropdown;
