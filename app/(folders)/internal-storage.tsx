import { View, Text, Alert, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { readDir, ExternalStorageDirectoryPath } from "react-native-fs";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";

import FolderPreview from "@/components/folder-preview";
import FilePreview from "@/components/file-preview";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { getFileType } from "@/utils/get-file-type";

import type { FileOrFolderType } from "@/types";

const InternalStorage = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-internal-storage"],
    queryFn: async () => {
      const filesAndFolders: FileOrFolderType[] = (
        await readDir(ExternalStorageDirectoryPath)
      ).map((item) => ({
        id: item.path,
        path: item.path,
        modificationTime: new Date(item.mtime ?? 0).getTime(),
        name: item.name,
        type: item.isDirectory() ? "folder" : "file",
        uri: `file://${item.path}`,
        size: item.size,
        fileType: getFileType(item.name),
      }));

      return filesAndFolders.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured.");
  }
  return (
    <View style={tw`flex-1 bg-white px-2 pt-1.5`}>
      <Stack.Screen
        options={{
          title:
            selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : "Internal Storage",
        }}
      />

      {isLoading ? (
        <ActivityIndicator size={40} color={"blue"} />
      ) : data && data.length > 0 ? (
        <FlashList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <>
                {item.type === "folder" ? (
                  <FolderPreview folder={item} />
                ) : (
                  <FilePreview file={item} />
                )}
              </>
            );
          }}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`items-center`}>
          <Text style={tw`text-rose-600 font-semibold`}>No data to show.</Text>
        </View>
      )}
    </View>
  );
};

export default InternalStorage;
