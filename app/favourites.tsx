import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";

import FilePreview from "@/components/file-preview";

import { useFavourites } from "@/hooks/use-favourites";

const Favourites = () => {
  const favourites = useFavourites((state) => state.favourites);
  return (
    <View style={tw`flex-1 bg-white px-2 pt-1.5`}>
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
          <Text style={tw`text-rose-600 font-semibold`}>No data to show.</Text>
        </View>
      )}
    </View>
  );
};

export default Favourites;
