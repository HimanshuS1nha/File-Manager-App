import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useQuery } from "@tanstack/react-query";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";

import CustomSectionList from "@/components/custom-section-list";
import MenuDropdown from "@/components/dropdown/menu-dropdown";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useEndCursor } from "@/hooks/use-end-cursor";

import { groupAndSortByDate } from "@/utils/group-and-sort-by-date";
import { getFileType } from "@/utils/get-file-type";

import type { FileOrFolderType } from "@/types";

const ImagesVideosAudio = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const { endCursor, setEndCursor } = useEndCursor();

  const { type } = useLocalSearchParams() as {
    type: "Images" | "Videos" | "Audio";
  };

  const [files, setFiles] = useState<
    { title: Date; data: FileOrFolderType[] }[]
  >([]);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [`get-${type}-${endCursor}`],
    queryFn: async () => {
      const result = await MediaLibrary.getAssetsAsync({
        mediaType:
          type === "Images"
            ? MediaLibrary.MediaType.photo
            : type === "Videos"
            ? MediaLibrary.MediaType.video
            : MediaLibrary.MediaType.audio,
        after: endCursor,
      });

      let assets: FileOrFolderType[] = [];

      for await (const ele of result.assets) {
        const assetInfo = (await FileSystem.getInfoAsync(ele.uri)) as {
          size: number;
        };

        assets.push({
          id: ele.id,
          modificationTime: ele.modificationTime,
          name: ele.filename,
          path: ele.uri.replace("file://", ""),
          type: "file",
          uri: ele.uri,
          fileType: getFileType(ele.filename),
          size: assetInfo.size,
        });
      }

      return { assets, endCursor: result.endCursor };
    },
  });
  if (error) {
    Alert.alert("Error", "Some error occured.");
  }

  const menuDropdownData = useMemo(() => {
    return files.reduce((acc, file) => {
      file.data.map((item) => {
        acc.push(item);
      });

      return acc;
    }, [] as FileOrFolderType[]);
  }, [files]);

  useEffect(() => {
    if (data && data.assets) {
      setFiles((prev) => {
        const newFiles = [...prev];
        return groupAndSortByDate(newFiles, data.assets);
      });
      setEndCursor(data.endCursor);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setEndCursor(undefined);
        setFiles([]);
      };
    }, [])
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title:
            selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : type,
        }}
      />

      <MenuDropdown hideSomeOptions data={menuDropdownData} />

      <View style={tw`px-2 pt-1.5`}>
        {isLoading ? (
          <ActivityIndicator size={40} color={"blue"} />
        ) : files.length > 0 ? (
          <CustomSectionList data={files} onEndReached={refetch} />
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

export default ImagesVideosAudio;
