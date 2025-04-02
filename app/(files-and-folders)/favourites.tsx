import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";

import FilePreview from "@/components/file-preview";
import MenuDropdown from "@/components/dropdown/menu-dropdown";

import { useFavourites } from "@/hooks/use-favourites";
import { useSelectedItems } from "@/hooks/use-selected-items";

const Favourites = () => {
  const favourites = useFavourites((state) => state.favourites);
  const selectedItems = useSelectedItems((state) => state.selectedItems);
  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title:
            selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : "Favourites",
        }}
      />

      <MenuDropdown data={favourites} />

      <View style={tw`px-2 pt-1.5 flex-1`}>
        {favourites.length > 0 ? (
          <FlashList
            data={favourites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <FilePreview file={item} />;
            }}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
          />
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

export default Favourites;
