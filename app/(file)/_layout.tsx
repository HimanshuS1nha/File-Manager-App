import { View, Pressable, Alert } from "react-native";
import React, { useCallback, useMemo } from "react";
import tw from "twrnc";
import { Stack } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";

import FileDropdown from "@/components/dropdown/file-dropdown";

import { useSelectedFile } from "@/hooks/use-selected-file";
import { useFavourites } from "@/hooks/use-favourites";
import { useFileDropdown } from "@/hooks/use-file-dropdown";

const FileLayout = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const setSelectedFile = useSelectedFile((state) => state.setSelectedFile);

  const favourites = useFavourites((state) => state.favourites);
  const updateFavourites = useFavourites((state) => state.updateFavourites);

  const setIsFileDropdownVisible = useFileDropdown(
    (state) => state.setIsVisible
  );

  const isFavourite = useMemo(
    () => !!favourites.find((favourite) => favourite.id === selectedFile?.id),
    [favourites, selectedFile]
  );

  const handleShare = useCallback(() => {
    Sharing.isAvailableAsync().then((res) => {
      if (res) {
        Sharing.shareAsync(selectedFile!.uri).catch((e) => {
          Alert.alert("Error", "Error in sharing the file");
        });
      } else {
        Alert.alert("Error", "Sharing is not supported on your device");
      }
    });
  }, [selectedFile]);
  return (
    <>
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
              <Pressable
                onPress={() => {
                  setSelectedFile(null);
                  router.back();
                }}
              >
                <AntDesign name="arrowleft" size={24} color="white" />
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <View style={tw`flex-row gap-x-5 items-center`}>
                <Pressable onPress={handleShare}>
                  <AntDesign name="sharealt" size={24} color="white" />
                </Pressable>
                <Pressable onPress={() => updateFavourites(selectedFile!)}>
                  <AntDesign
                    name={isFavourite ? "star" : "staro"}
                    size={24}
                    color="white"
                  />
                </Pressable>
                <Pressable onPress={() => setIsFileDropdownVisible(true)}>
                  <FontAwesome6
                    name="ellipsis-vertical"
                    size={24}
                    color="white"
                  />
                </Pressable>
              </View>
            );
          },
        }}
      >
        <Stack.Screen
          name="pdf-file"
          options={{
            headerRight: () => {
              return (
                <View style={tw`flex-row gap-x-5 items-center`}>
                  <Pressable onPress={handleShare}>
                    <AntDesign name="sharealt" size={24} color="black" />
                  </Pressable>
                  <Pressable onPress={() => updateFavourites(selectedFile!)}>
                    <AntDesign
                      name={isFavourite ? "star" : "staro"}
                      size={24}
                      color="black"
                    />
                  </Pressable>
                  <Pressable onPress={() => setIsFileDropdownVisible(true)}>
                    <FontAwesome6
                      name="ellipsis-vertical"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                </View>
              );
            },
          }}
        />
      </Stack>

      <FileDropdown />
    </>
  );
};

export default FileLayout;
