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

import { groupAndSortByDate } from "@/utils/group-and-sort-by-date";
import { getFileType } from "@/utils/get-file-type";

const Files = () => {
  const { type } = useLocalSearchParams() as { type: "Zip" | "Apk" };

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
          if (ele.name.toLowerCase().endsWith(type.toLowerCase())) {
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

      return groupAndSortByDate(
        [],
        files.map((item) => ({
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
      <Stack.Screen options={{ title: type }} />

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

export default Files;
