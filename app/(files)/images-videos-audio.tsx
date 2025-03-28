import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useQuery } from "@tanstack/react-query";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";

import { groupAndSortByDate } from "@/utils/group-and-sort-by-date";
import { getFileType } from "@/utils/get-file-type";

import type { FileOrFolderType } from "@/types";

const ImagesVideosAudio = () => {
  const { type } = useLocalSearchParams() as {
    type: "Images" | "Videos" | "Audio";
  };

  const [files, setFiles] = useState<
    { title: Date; data: FileOrFolderType[] }[]
  >([]);
  const [endCursor, setEndCursor] = useState<string>();

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

  useEffect(() => {
    if (data && data.assets) {
      setFiles((prev) => groupAndSortByDate(prev, data.assets));
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
      <Stack.Screen options={{ title: type }} />

      <View style={tw`px-2 pt-1.5`}>
        {isLoading ? (
          <ActivityIndicator size={40} color={"blue"} />
        ) : files.length > 0 ? (
          // TODO: Show all files here
          <></>
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
