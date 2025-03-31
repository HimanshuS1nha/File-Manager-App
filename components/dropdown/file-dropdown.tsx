import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";

import { useFileDropdown } from "@/hooks/use-file-dropdown";

const FileDropdown = () => {
  const { isVisible, setIsVisible } = useFileDropdown();
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
    >
      <Pressable style={tw`flex-1`} onPress={() => setIsVisible(false)}>
        <View
          style={tw`absolute right-2 top-[6%] bg-gray-800 shadow-lg shadow-white p-4 rounded-lg justify-center w-[40%] gap-y-5`}
        >
          <Pressable>
            <Text style={tw`text-white text-base`}>Info</Text>
          </Pressable>
          <Pressable>
            <Text style={tw`text-white text-base`}>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FileDropdown;
