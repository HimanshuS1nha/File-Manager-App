import { View, Pressable } from "react-native";
import React, { useMemo } from "react";
import tw from "twrnc";
import { Stack } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

import { useSelectedFile } from "@/hooks/use-selected-file";
import { useFavourites } from "@/hooks/use-favourites";

const FileLayout = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const favourites = useFavourites((state) => state.favourites);
  const updateFavourites = useFavourites((state) => state.updateFavourites);

  const isFavourite = useMemo(
    () => !!favourites.find((favourite) => favourite.id === selectedFile?.id),
    [favourites, selectedFile]
  );
  return (
    <Stack
      screenOptions={{
        title: "",
        statusBarBackgroundColor: "#000",
        statusBarStyle: "light",
        headerStyle: {
          backgroundColor: "#000",
        },
        headerBackVisible: false,
        headerLeft: () => {
          return (
            <Pressable onPress={router.back}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>
          );
        },
        headerRight: () => {
          return (
            <View style={tw`flex-row gap-x-5 items-center`}>
              <AntDesign name="sharealt" size={24} color="white" />
              <Pressable onPress={() => updateFavourites(selectedFile!)}>
                <AntDesign
                  name={isFavourite ? "star" : "staro"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <FontAwesome6 name="ellipsis-vertical" size={24} color="white" />
            </View>
          );
        },
      }}
    />
  );
};

export default FileLayout;
