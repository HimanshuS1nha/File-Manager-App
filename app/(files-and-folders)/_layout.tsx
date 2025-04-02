import { View, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { Stack, router, usePathname } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { readDir, unlink } from "react-native-fs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import MenuDropdown from "@/components/dropdown/menu-dropdown";
import FilePreviewDropdown from "@/components/dropdown/file-preview-dropdown";
import RenameModal from "@/components/modal/rename-modal";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useMenuDropdown } from "@/hooks/use-menu-dropdown";
import { useFavourites } from "@/hooks/use-favourites";
import { useRecentFiles } from "@/hooks/use-recent-files";

import { getFileType } from "@/utils/get-file-type";

import type { FileOrFolderType } from "@/types";

const FilesAndFoldersLayout = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItems(
    (state) => state.clearSelectedItems
  );

  const setIsMenuDropdownVisible = useMenuDropdown(
    (state) => state.setIsVisible
  );

  const favourites = useFavourites((state) => state.favourites);
  const updateFavourites = useFavourites((state) => state.updateFavourites);
  const doesFavouritesContain = useFavourites((state) => state.contains);

  const recentFiles = useRecentFiles((state) => state.recentFiles);
  const removeFromRecentFiles = useRecentFiles(
    (state) => state.removeFromRecentFiles
  );
  const doesRecentFilesContain = useRecentFiles((state) => state.contains);

  const handleDeleteItem = useCallback(
    async (file: FileOrFolderType) => {
      await unlink(file.path);

      if (doesFavouritesContain(file)) {
        updateFavourites(file);
      }

      if (doesRecentFilesContain(file)) {
        removeFromRecentFiles(file);
      }
    },
    [favourites, recentFiles]
  );

  const handleDeleteFolder = useCallback(async (file: FileOrFolderType) => {
    const filesAndFolders = await readDir(file.path);

    for (const ele of filesAndFolders) {
      if (ele.isDirectory()) {
        await handleDeleteFolder({
          id: ele.path,
          modificationTime: new Date(ele.mtime ?? 0).getTime(),
          name: ele.name,
          path: ele.path,
          size: ele.size,
          type: ele.isDirectory() ? "folder" : "file",
          uri: `file://${file.path}`,
          fileType: getFileType(ele.name),
        });
        await handleDeleteItem({
          id: ele.path,
          modificationTime: new Date(ele.mtime ?? 0).getTime(),
          name: ele.name,
          path: ele.path,
          size: ele.size,
          type: ele.isDirectory() ? "folder" : "file",
          uri: `file://${file.path}`,
          fileType: getFileType(ele.name),
        });
      } else {
        handleDeleteItem({
          id: ele.path,
          modificationTime: new Date(ele.mtime ?? 0).getTime(),
          name: ele.name,
          path: ele.path,
          size: ele.size,
          type: ele.isDirectory() ? "folder" : "file",
          uri: `file://${file.path}`,
          fileType: getFileType(ele.name),
        });
      }
    }

    await handleDeleteItem(file);
  }, []);

  const { mutate: handleDeleteSelectedItems, isPending } = useMutation({
    mutationKey: ["delete-selected-items"],
    mutationFn: async () => {
      for (const selectedItem of selectedItems) {
        if (selectedItem.type === "file") {
          await handleDeleteItem(selectedItem);
        } else {
          await handleDeleteFolder(selectedItem);
        }
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      clearSelectedItems();
    },
    onError: () => {
      Alert.alert("Error", "Error while deleting the items");
    },
  });
  return (
    <>
      <Stack
        screenOptions={{
          headerLeft: () => {
            return (
              <>
                {selectedItems.length > 0 ? (
                  <Pressable style={tw`mr-5`} onPress={clearSelectedItems}>
                    <AntDesign name="close" size={24} color={"black"} />
                  </Pressable>
                ) : (
                  <Pressable style={tw`mr-5`} onPress={router.back}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                  </Pressable>
                )}
              </>
            );
          },
          headerRight: () => {
            return (
              <View style={tw`flex-row gap-x-5 items-center`}>
                {selectedItems.length > 0 && (
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Warning",
                        "Do you want to delete these items?",
                        [
                          {
                            text: "No",
                            onPress: clearSelectedItems,
                          },
                          {
                            text: "Yes",
                            onPress: () => handleDeleteSelectedItems(),
                          },
                        ]
                      )
                    }
                    disabled={isPending}
                  >
                    <FontAwesome6 name="trash" size={24} color="black" />
                  </Pressable>
                )}
                <Pressable onPress={() => setIsMenuDropdownVisible(true)}>
                  <FontAwesome6
                    name="ellipsis-vertical"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </View>
            );
          },
        }}
      />

      <FilePreviewDropdown />

      <RenameModal />
    </>
  );
};

export default FilesAndFoldersLayout;
