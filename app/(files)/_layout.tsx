import { View, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Stack, router } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useMenuDropdown } from "@/hooks/use-menu-dropdown";

const FilesLayout = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItems(
    (state) => state.clearSelectedItems
  );

  const setIsMenuDropdownVisible = useMenuDropdown(
    (state) => state.setIsVisible
  );
  return (
    <Stack
      screenOptions={{
        headerLeft: () => {
          return (
            <>
              {selectedItems.length > 0 ? (
                <Pressable style={tw`mr-5`} onPress={clearSelectedItems}>
                  <AntDesign name="close" size={24} color={"black"} />
                </Pressable>
              ) : (
                <Pressable style={tw`mr-5`} onPress={router.back}>
                  <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
              )}
            </>
          );
        },
        headerRight: () => {
          return (
            <View style={tw`flex-row gap-x-5 items-center`}>
              {selectedItems.length > 0 && (
                <>
                  <FontAwesome6 name="trash" size={24} color="black" />
                </>
              )}
              <Pressable onPress={() => setIsMenuDropdownVisible(true)}>
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
  );
};

export default FilesLayout;
