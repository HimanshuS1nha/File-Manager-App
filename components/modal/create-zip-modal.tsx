import { View, Text, Modal, Pressable, TextInput, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zip } from "react-native-zip-archive";
import { ZodError } from "zod";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { useCreateZipModal } from "@/hooks/use-create-zip-modal";

import { nameValidator } from "@/validators/name-validator";

const CreateZipModal = ({ path }: { path: string }) => {
  const queryClient = useQueryClient();

  const selectedItems = useSelectedItems((state) => state.selectedItems);
  const clearSelectedItems = useSelectedItems(
    (state) => state.clearSelectedItems
  );

  const { isVisible, setIsVisible } = useCreateZipModal();

  const [zipName, setZipName] = useState("");

  const handleChangeZipName = useCallback(
    (value: string) => setZipName(value),
    []
  );

  const { mutate: handleCreateZip, isPending } = useMutation({
    mutationKey: ["create-zip"],
    mutationFn: async () => {
      const parsedData = await nameValidator.parseAsync({ name: zipName });

      await zip(
        selectedItems.map((selectedItem) => selectedItem.path),
        `${path}/${parsedData.name}.zip`
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries();
      clearSelectedItems();
      setIsVisible(false);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else {
        Alert.alert("Error", "Error while creating zip");
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

          <Text style={tw`text-xl font-bold mt-4`}>Name of Zip File</Text>

          <TextInput
            style={tw`w-full bg-gray-200 py-4 px-3 rounded-lg`}
            placeholder="Enter zip name"
            value={zipName}
            onChangeText={handleChangeZipName}
          />

          <Pressable
            style={tw`${
              isPending ? "bg-indigo-400" : "bg-indigo-600"
            } p-3 items-center justify-center w-full rounded-lg`}
            onPress={() => handleCreateZip()}
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

export default CreateZipModal;
