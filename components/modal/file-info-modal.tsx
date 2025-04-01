import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";

import { useFileInfoModal } from "@/hooks/use-file-info-modal";
import { useSelectedFile } from "@/hooks/use-selected-file";

import { formatFileSize } from "@/utils/format-file-size";

const FileInfoModal = () => {
  const { isVisible, setIsVisible } = useFileInfoModal();

  const selectedFile = useSelectedFile((state) => state.selectedFile);
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="slide"
    >
      <View style={tw`flex-1 items-center bg-gray-900/70`}>
        <View
          style={tw`absolute bottom-[2%] bg-white shadow-lg shadow-white p-4 rounded-lg justify-center w-[93%] gap-y-5`}
        >
          <Pressable
            style={tw`absolute right-2.5 top-2.5`}
            onPress={() => setIsVisible(false)}
          >
            <AntDesign name="close" size={24} color={"black"} />
          </Pressable>

          <View style={tw`gap-y-5 items-center mt-6`}>
            <View style={tw`flex-row justify-between items-center w-[95%]`}>
              <Text>Filename</Text>
              <Text style={tw`font-medium`}>
                {selectedFile!.name.length > 25
                  ? selectedFile?.name.substring(0, 25) + "..."
                  : selectedFile?.name}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center w-[95%]`}>
              <Text>Size</Text>
              <Text style={tw`font-medium`}>
                {formatFileSize(selectedFile!.size)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center w-[95%]`}>
              <Text>Date</Text>
              <Text style={tw`font-medium`}>
                {new Date(selectedFile!.modificationTime).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FileInfoModal;
