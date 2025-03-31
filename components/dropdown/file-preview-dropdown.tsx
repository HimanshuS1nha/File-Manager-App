import { View, Text, Modal, Pressable, Alert } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlink } from "react-native-fs";

import { useFilePreviewDropdown } from "@/hooks/use-file-preview-dropdown";
import { useRenameModal } from "@/hooks/use-rename-modal";

const FilePreviewDropdown = () => {
  const queryClient = useQueryClient();

  const {
    isVisible,
    position,
    selectedFilePath,
    setIsVisible,
    setPosition,
    setSelectedFilePath,
  } = useFilePreviewDropdown();

  const setIsRenameModalVisible = useRenameModal((state) => state.setIsVisible);
  const setRenameModalSelectedFilePath = useRenameModal(
    (state) => state.setSelectedFilePath
  );

  const handleClose = useCallback(() => {
    setPosition({ left: 0, top: 0 });
    setSelectedFilePath(null);
    setIsVisible(false);
  }, []);

  const handleOpenRenameModal = useCallback(() => {
    setRenameModalSelectedFilePath(selectedFilePath);
    setIsRenameModalVisible(true);
    setIsVisible(false);
  }, [selectedFilePath]);

  const { mutate: handleDeleteFile, isPending } = useMutation({
    mutationKey: ["delete-file"],
    mutationFn: async () => {
      if (!selectedFilePath) {
        throw new Error("No file selected.");
      }

      await unlink(selectedFilePath!);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      handleClose();
    },
    onError: () => {
      Alert.alert("Error", "Error in deleting file");
    },
  });
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={handleClose}
      animationType="fade"
    >
      <Pressable style={tw`flex-1`} onPress={handleClose}>
        <View
          style={tw`absolute bg-white shadow-lg shadow-black p-4 rounded-lg justify-center w-[40%] gap-y-5 top-[${position.top}px] left-[${position.left}px]`}
        >
          <Pressable onPress={handleOpenRenameModal}>
            <Text style={tw`text-base`}>Rename</Text>
          </Pressable>
          <Pressable>
            <Text style={tw`text-base`}>Move to</Text>
          </Pressable>
          <Pressable>
            <Text style={tw`text-base`}>Copy to</Text>
          </Pressable>
          <Pressable onPress={() => handleDeleteFile()} disabled={isPending}>
            <Text style={tw`text-base`}>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FilePreviewDropdown;
