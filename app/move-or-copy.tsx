import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  readDir,
  ExternalStorageDirectoryPath,
  moveFile,
  copyFile,
} from "react-native-fs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import CreateFolderModal from "@/components/modal/create-folder-modal";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useCreateFolderModal } from "@/hooks/use-create-folder-modal";

const MoveOrCopy = () => {
  const queryClient = useQueryClient();
  const { action } = useLocalSearchParams() as { action: "Move" | "Copy" };

  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItems(
    (state) => state.clearSelectedItems
  );

  const setIsCreateFolderModalVisible = useCreateFolderModal(
    (state) => state.setIsVisible
  );

  const [currentPath, setCurrentPath] = useState(ExternalStorageDirectoryPath);
  const [breadCrumbs, setBreadCrumbs] = useState([
    { title: "Internal Storage", path: ExternalStorageDirectoryPath },
  ]);

  const { data, isLoading } = useQuery({
    queryKey: [`get-${currentPath}`],
    queryFn: async () => {
      const folders = (await readDir(currentPath)).filter((item) =>
        item.isDirectory()
      );

      return folders;
    },
  });

  const handleGoBack = useCallback(() => {
    setCurrentPath(breadCrumbs[breadCrumbs.length - 2].path);
    setBreadCrumbs((prev) => {
      const newBreadCrumbs = [...prev];
      newBreadCrumbs.pop();
      return newBreadCrumbs;
    });
  }, [breadCrumbs]);

  const handleClose = useCallback(() => {
    clearSelectedItems();
    router.back();
  }, []);

  const { mutate: handleSelectFolder, isPending } = useMutation({
    mutationKey: [`${action}`],
    mutationFn: async () => {
      if (action === "Move") {
        for (const selectedItem of selectedItems) {
          await moveFile(
            selectedItem.path,
            `${currentPath}/${selectedItem.name}`
          );
        }
      } else if (action === "Copy") {
        for (const selectedItem of selectedItems) {
          await copyFile(
            selectedItem.path,
            `${currentPath}/${selectedItem.name}`
          );
        }
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      handleClose();
    },
    onError: () => {
      Alert.alert("Error", `Error in moving/copying files`);
    },
  });
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title: `${action} to`,
          headerLeft: () => {
            return (
              <Pressable style={tw`mr-5`} onPress={handleClose}>
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <Pressable onPress={() => setIsCreateFolderModalVisible(true)}>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </Pressable>
            );
          },
        }}
      />

      <CreateFolderModal path={currentPath} />

      <View
        style={tw`px-4 pt-2 pb-3.5 flex-row gap-x-2 border-b border-b-gray-200`}
      >
        {breadCrumbs.length > 3 ? (
          <>
            <View style={tw`flex-row gap-x-2 items-center`}>
              <Text style={tw`font-semibold`}>Internal Storage</Text>
              <AntDesign name="right" size={12} color={"black"} />
            </View>
            <View style={tw`flex-row gap-x-2 items-center`}>
              <Text style={tw`font-semibold`}>...</Text>
              <AntDesign name="right" size={12} color={"black"} />
            </View>
            <View style={tw`flex-row gap-x-2 items-center`}>
              <Text style={tw`font-semibold`}>...</Text>
              <AntDesign name="right" size={12} color={"black"} />
            </View>
            <Text style={tw`text-indigo-600 font-semibold`}>
              {breadCrumbs[breadCrumbs.length - 1].title}
            </Text>
          </>
        ) : (
          breadCrumbs.map((item, i) => {
            return (
              <View key={item.title} style={tw`flex-row gap-x-2 items-center`}>
                <Text
                  style={tw`${
                    i === breadCrumbs.length - 1 ? "text-indigo-600" : ""
                  } font-semibold`}
                >
                  {item.title}
                </Text>
                {i !== breadCrumbs.length - 1 && (
                  <AntDesign name="right" size={12} color={"black"} />
                )}
              </View>
            );
          })
        )}
      </View>

      <View style={tw`px-2 py-1.5 flex-1`}>
        {isLoading ? (
          <ActivityIndicator size={40} color={"blue"} />
        ) : data && data.length > 0 ? (
          <FlashList
            data={data}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              return (
                <Pressable
                  style={tw`flex-row gap-x-5 items-center px-2 py-2.5`}
                  onPress={() => {
                    setCurrentPath(item.path);
                    setBreadCrumbs((prev) => {
                      const newBreadCrumbs = [...prev];
                      newBreadCrumbs.push({
                        title: item.name,
                        path: item.path,
                      });
                      return newBreadCrumbs;
                    });
                  }}
                >
                  <FontAwesome name="folder" size={42} color="#4F46E5" />

                  <Text style={tw`font-medium text-base`}>
                    {item.name.length > 30
                      ? item.name.substring(0, 30) + "..."
                      : item.name}
                  </Text>
                </Pressable>
              );
            }}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={50}
          />
        ) : (
          <View style={tw`items-center`}>
            <Text style={tw`text-rose-600 font-semibold`}>
              No data to show.
            </Text>
          </View>
        )}
      </View>

      <View
        style={tw`h-[50px] px-4 pb-2 flex-row items-center justify-between`}
      >
        <Pressable
          style={tw`w-[48%] items-center justify-center h-full ${
            breadCrumbs.length < 2 ? "bg-gray-400" : "bg-gray-600"
          } rounded-full`}
          onPress={handleGoBack}
          disabled={breadCrumbs.length < 2 || isPending}
        >
          <Text style={tw`font-medium text-white text-base`}>Go Back</Text>
        </Pressable>
        <Pressable
          style={tw`w-[48%] items-center justify-center h-full ${
            isPending ? "bg-indigo-400" : "bg-indigo-600"
          } rounded-full`}
          onPress={() => handleSelectFolder()}
          disabled={isPending}
        >
          <Text style={tw`font-medium text-white text-base`}>
            {isPending ? "Please wait..." : "Select Folder"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MoveOrCopy;
