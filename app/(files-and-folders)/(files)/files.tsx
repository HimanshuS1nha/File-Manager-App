import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  readDir,
  ExternalStorageDirectoryPath,
  type ReadDirItem,
} from "react-native-fs";
import { useQuery } from "@tanstack/react-query";

import CustomSectionList from "@/components/custom-section-list";
import MenuDropdown from "@/components/dropdown/menu-dropdown";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { groupAndSortByDate } from "@/utils/group-and-sort-by-date";
import { getFileType } from "@/utils/get-file-type";

const Files = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const { type, title } = useLocalSearchParams() as {
    type: string[];
    title: string;
  };

  const getFilesRecursively = async (directoryPath: string) => {
    const filesAndFolders = await readDir(directoryPath);
    let files: ReadDirItem[] = [];

    try {
      for (const ele of filesAndFolders) {
        if (ele.isDirectory()) {
          const subFilesAndFolders = await getFilesRecursively(ele.path);
          if (subFilesAndFolders.length !== 0) {
            files = [...files, ...subFilesAndFolders];
          }
        } else {
          if (
            type.includes(
              ele.name.split(".")[ele.name.split(".").length - 1].toLowerCase()
            )
          ) {
            files.push(ele);
          }
        }
      }
    } catch {
      return [];
    }

    return files;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`get-file-${type}`],
    queryFn: async () => {
      const files = await getFilesRecursively(ExternalStorageDirectoryPath);

      const updatedFiles = files.map((item) => ({
        id: item.path,
        path: item.path,
        modificationTime: new Date(item.mtime ?? 0).getTime(),
        name: item.name,
        type: item.isDirectory() ? ("folder" as const) : ("file" as const),
        uri: `file://${item.path}`,
        fileType: getFileType(item.name),
        size: item.size,
      }));

      return {
        data: groupAndSortByDate([], updatedFiles),
        files: updatedFiles,
      };
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

      {data && data.files && <MenuDropdown hideSomeOptions data={data.files} />}

      <View style={tw`px-2 pt-1.5`}>
        {isLoading ? (
          <ActivityIndicator size={40} color={"blue"} />
        ) : data && data.data && data.data.length > 0 ? (
          <CustomSectionList data={data.data} />
        ) : (
          <View style={tw`items-center mt-2.5`}>
            <Text style={tw`text-rose-600 font-semibold`}>
              No data to show.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Files;
