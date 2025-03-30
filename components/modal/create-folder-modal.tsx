import { View, Text, Modal, TextInput, Pressable, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { mkdir } from "react-native-fs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AntDesign } from "@expo/vector-icons";
import { ZodError } from "zod";

import { useCreateFolderModal } from "@/hooks/use-create-folder-modal";

import { nameValidator } from "@/validators/name-validator";

const CreateFolderModal = ({ path }: { path: string }) => {
  const queryClient = useQueryClient();

  const { isVisible, setIsVisible } = useCreateFolderModal();

  const [folderName, setFolderName] = useState("");

  const handleChangeFolderName = useCallback(
    (value: string) => setFolderName(value),
    []
  );

  const { mutate: handleCreateFolder, isPending } = useMutation({
    mutationKey: ["create-folder"],
    mutationFn: async () => {
      await mkdir(`${path}/${folderName}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      setIsVisible(false);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else {
        Alert.alert("Error", "Error while creating folder");
      }
    },
  });
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-gray-100/70`}>
        <View
          style={tw`bg-white w-[80%] p-4 items-center gap-y-6 shadow-lg shadow-gray-300 rounded-lg`}
        >
          <Pressable
            style={tw`absolute top-2 right-2`}
            onPress={() => setIsVisible(false)}
          >
            <AntDesign name="close" size={24} color={"black"} />
          </Pressable>

          <Text style={tw`text-xl font-bold mt-4`}>Create Folder</Text>

          <TextInput
            style={tw`w-full bg-gray-200 py-4 px-3 rounded-lg`}
            placeholder="Enter folder name"
            value={folderName}
            onChangeText={handleChangeFolderName}
          />

          <Pressable
            style={tw`${
              isPending ? "bg-indigo-400" : "bg-indigo-600"
            } p-3 items-center justify-center w-full rounded-lg`}
            onPress={() => handleCreateFolder()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-medium`}>
              {isPending ? "Please wait..." : "Create"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CreateFolderModal;
