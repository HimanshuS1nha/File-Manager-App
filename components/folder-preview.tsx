import { Text, Pressable } from "react-native";
import React, { useCallback, useMemo } from "react";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

import { useSelectedItems } from "@/hooks/use-selected-items";

import type { FileOrFolderType } from "@/types";

const FolderPreview = ({ folder }: { folder: FileOrFolderType }) => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const updateSelectedItems = useSelectedItems(
    (state) => state.updateSelectedItems
  );

  const isFolderSelected = useMemo(
    () => !!selectedItems.find((selectedItem) => selectedItem.id === folder.id),
    [selectedItems, folder]
  );

  const handlePress = useCallback(() => {
    if (selectedItems.length > 0) {
      updateSelectedItems(folder);
    } else {
      router.push({
        pathname: "/folders",
        params: {
          title: folder.name,
          path: folder.path,
        },
      });
    }
  }, [folder, selectedItems]);

  const handleLongPress = useCallback(() => {
    updateSelectedItems(folder);
  }, [folder]);
  return (
    <Pressable
      style={tw`flex-row gap-x-5 items-center px-2 py-2 my-0.5 ${
        isFolderSelected ? "bg-indigo-100 rounded-lg" : ""
      }`}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <FontAwesome name="folder" size={42} color="#4F46E5" />

      <Text style={tw`font-medium text-base`}>
        {folder.name.length > 30
          ? folder.name.substring(0, 30) + "..."
          : folder.name}
      </Text>
    </Pressable>
  );
};

export default FolderPreview;
