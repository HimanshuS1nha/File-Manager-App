import { View, Text, SectionList, Pressable } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";

import FilePreview from "./file-preview";
import FolderPreview from "./folder-preview";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { days } from "@/constants/days";
import { months } from "@/constants/months";

import type { FileOrFolderType } from "../types";

const CustomSectionList = ({
  data,
  onEndReached,
}: {
  data: { title: Date; data: FileOrFolderType[] }[];
  onEndReached?: () => void;
}) => {
  const updateSelectedItems = useSelectedItems(
    (state) => state.updateSelectedItems
  );

  const handlePress = useCallback(
    (title: Date) => {
      data.map((item) => {
        if (item.title === title) {
          for (const ele of item.data) {
            updateSelectedItems(ele);
          }
        }
      });
    },
    [data]
  );
  return (
    <SectionList
      sections={data}
      keyExtractor={(item) => item.path}
      renderItem={({ item }) => (
        <>
          {item.type === "folder" ? (
            <FolderPreview folder={item} />
          ) : (
            <FilePreview file={item} />
          )}
        </>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View
          style={tw`flex-row justify-between items-center mb-4.5 mt-2.5 px-2`}
        >
          <Text style={tw`text-lg font-semibold`}>
            {days[title.getDay()]}, {months[title.getMonth()]}{" "}
            {title.getDate().toString().padStart(2, "0")}
          </Text>
          <Pressable onPress={() => handlePress(title)}>
            <AntDesign name="checkcircleo" size={20} color="black" />
          </Pressable>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
    />
  );
};

export default CustomSectionList;
