import { View, Text, Modal, Pressable, TextInput, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveFile } from "react-native-fs";
import { ZodError } from "zod";

import { useRenameModal } from "@/hooks/use-rename-modal";
import { useFavourites } from "@/hooks/use-favourites";
import { useRecentFiles } from "@/hooks/use-recent-files";
import { useEndCursor } from "@/hooks/use-end-cursor";

import { nameValidator } from "@/validators/name-validator";

const RenameModal = () => {
  const queryClient = useQueryClient();

  const { isVisible, selectedFilePath, setIsVisible, setSelectedFilePath } =
    useRenameModal();

  const renameFileInFavourites = useFavourites((state) => state.renameFile);
  const renameFileInRecentFiles = useRecentFiles((state) => state.renameFile);

  const setEndCursor = useEndCursor((state) => state.setEndCursor);

  const [newName, setNewName] = useState("");

  const handleClose = useCallback(() => {
    setSelectedFilePath(null);
    setIsVisible(false);
  }, []);

  const handleChangeName = useCallback(
    (value: string) => setNewName(value),
    []
  );

  const { mutate: handleRename, isPending } = useMutation({
    mutationKey: ["rename"],
    mutationFn: async () => {
      if (!selectedFilePath) {
        throw new Error("No file selected.");
      }

      const parsedData = await nameValidator.parseAsync({ name: newName });

      const newFilePath = selectedFilePath.replace(
        selectedFilePath.split("/")[selectedFilePath.split("/").length - 1],
        parsedData.name
      );

      await moveFile(selectedFilePath, newFilePath);

      renameFileInFavourites(selectedFilePath, newName, newFilePath);
      renameFileInRecentFiles(selectedFilePath, newName, newFilePath);
    },
    onSettled: async () => {
      setEndCursor(undefined);
      await queryClient.invalidateQueries();
      handleClose();
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else {
        Alert.alert("Error", "Error in renaming file.");
      }
    },
  });

  useEffect(() => {
    if (selectedFilePath) {
      setNewName(
        selectedFilePath.split("/")[selectedFilePath.split("/").length - 1]
      );
    }
  }, [selectedFilePath]);
  return (
    <Modal transparent visible={isVisible} onRequestClose={handleClose}>
      <View style={tw`flex-1 justify-center items-center bg-gray-100/70`}>
        <View
          style={tw`bg-white w-[80%] p-4 items-center gap-y-6 shadow-lg shadow-gray-300 rounded-lg`}
        >
          <Pressable style={tw`absolute top-2 right-2`} onPress={handleClose}>
            <AntDesign name="close" size={24} color={"black"} />
          </Pressable>

          <Text style={tw`text-xl font-bold mt-4`}>Rename File</Text>

          <TextInput
            style={tw`w-full bg-gray-200 py-4 px-3 rounded-lg`}
            placeholder="Enter new name"
            value={newName}
            onChangeText={handleChangeName}
          />

          <Pressable
            style={tw`${
              isPending ? "bg-indigo-400" : "bg-indigo-600"
            } p-3 items-center justify-center w-full rounded-lg`}
            onPress={() => handleRename()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-medium`}>
              {isPending ? "Please wait..." : "Rename"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RenameModal;
