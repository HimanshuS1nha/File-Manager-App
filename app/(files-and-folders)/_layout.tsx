import { View, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { Stack, router } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { readDir, unlink } from "react-native-fs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import MenuDropdown from "@/components/dropdown/menu-dropdown";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useMenuDropdown } from "@/hooks/use-menu-dropdown";

const FilesAndFoldersLayout = () => {
  const queryClient = useQueryClient();

  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItems(
    (state) => state.clearSelectedItems
  );

  const setIsMenuDropdownVisible = useMenuDropdown(
    (state) => state.setIsVisible
  );

  const handleDeleteFile = useCallback(async (path: string) => {
    await unlink(path);
  }, []);

  const handleDeleteFolder = useCallback(async (path: string) => {
    const filesAndFolders = await readDir(path);

    for (const ele of filesAndFolders) {
      if (ele.isDirectory()) {
        await handleDeleteFolder(ele.path);
        await unlink(ele.path);
      } else {
        handleDeleteFile(ele.path);
      }
    }

    await unlink(path);
  }, []);

  const { mutate: handleDeleteSelectedItems, isPending } = useMutation({
    mutationKey: ["delete-selected-items"],
    mutationFn: async () => {
      for (const selectedItem of selectedItems) {
        if (selectedItem.type === "file") {
          await handleDeleteFile(selectedItem.path);
        } else {
          await handleDeleteFolder(selectedItem.path);
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
                        "Do you want to delete thses items?",
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

      <MenuDropdown />
    </>
  );
};

export default FilesAndFoldersLayout;
