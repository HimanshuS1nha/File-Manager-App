import { View, Text, SectionList } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";

import FilePreview from "./file-preview";
import FolderPreview from "./folder-preview";

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
          <AntDesign name="checkcircleo" size={20} color="black" />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
    />
  );
};

export default CustomSectionList;
