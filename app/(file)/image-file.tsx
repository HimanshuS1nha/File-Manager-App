import { View, Image } from "react-native";
import React from "react";
import tw from "twrnc";

import { useSelectedFile } from "@/hooks/use-selected-file";

const ImageFile = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  return (
    <View style={tw`flex-1 bg-black items-center justify-center`}>
      <Image source={{ uri: selectedFile?.uri }} style={tw`w-full h-[60%]`} />
    </View>
  );
};

export default ImageFile;
