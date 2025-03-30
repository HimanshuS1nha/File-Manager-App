import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { readDir, ExternalStorageDirectoryPath } from "react-native-fs";

import CustomSectionList from "@/components/custom-section-list";
import CreateFolderModal  from "@/components/modal/create-folder-modal";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { groupAndSortByDate } from "@/utils/group-and-sort-by-date";
import { getFileType } from "@/utils/get-file-type";

const Folders = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const { title, path } = useLocalSearchParams() as {
    title: string;
    path?: string;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`get-${title}`],
    queryFn: async () => {
      const filesAndFolders = await readDir(
        path ?? ExternalStorageDirectoryPath + `/${title}`
      );

      return groupAndSortByDate(
        [],
        filesAndFolders.map((item) => ({
          id: item.path,
          path: item.path,
          modificationTime: new Date(item.mtime ?? 0).getTime(),
          name: item.name,
          type: item.isDirectory() ? "folder" : "file",
          uri: `file://${item.path}`,
          fileType: getFileType(item.name),
          size: item.size,
        }))
      );
    },
  });
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title:
            selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : title,
        }}
      />

      <CreateFolderModal path={path??`${ExternalStorageDirectoryPath}/${title}`}/>

      <View style={tw`px-2 pt-1.5`}>
        {isLoading ? (
          <ActivityIndicator size={40} color={"blue"} />
        ) : data && data.length > 0 ? (
          <CustomSectionList data={data} />
        ) : (
          <View style={tw`items-center`}>
            <Text style={tw`text-rose-600 font-semibold`}>
              No data to show.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Folders;
