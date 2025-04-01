import { View, Text, Pressable, Modal } from "react-native";
import React from "react";
import tw from "twrnc";

import { useSelectedItems } from "@/hooks/use-selected-items";
import { useMenuDropdown } from "@/hooks/use-menu-dropdown";
import { useCreateFolderModal } from "@/hooks/use-create-folder-modal";
import { useCreateZipModal } from "@/hooks/use-create-zip-modal";
import { router } from "expo-router";

const MenuDropdown = ({ hideSomeOptions }: { hideSomeOptions: boolean }) => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const setIsCreateFolderModalVisible = useCreateFolderModal(
    (state) => state.setIsVisible
  );

  const setIsCreateZipModalVisible = useCreateZipModal(
    (state) => state.setIsVisible
  );

  const { isVisible, setIsVisible } = useMenuDropdown();
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
    >
      <Pressable style={tw`flex-1`} onPress={() => setIsVisible(false)}>
        <View
          style={tw`absolute right-2 top-[6%] bg-white shadow-lg shadow-black p-4 rounded-lg justify-center w-[40%] gap-y-5`}
        >
          {selectedItems.length > 0
            ? !hideSomeOptions && (
                <>
                  <Pressable
                    onPress={() => {
                      setIsVisible(false);
                      router.push({
                        pathname: "/move-or-copy",
                        params: {
                          action: "Move",
                        },
                      });
                    }}
                  >
                    <Text style={tw`text-base`}>Move to</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setIsVisible(false);
                      router.push({
                        pathname: "/move-or-copy",
                        params: {
                          action: "Copy",
                        },
                      });
                    }}
                  >
                    <Text style={tw`text-base`}>Copy to</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setIsVisible(false);
                      setIsCreateZipModalVisible(true);
                    }}
                  >
                    <Text style={tw`text-base`}>Add to Zip</Text>
                  </Pressable>
                </>
              )
            : !hideSomeOptions && (
                <Pressable
                  onPress={() => {
                    setIsVisible(false);
                    setIsCreateFolderModalVisible(true);
                  }}
                >
                  <Text style={tw`text-base`}>New folder</Text>
                </Pressable>
              )}
          <Pressable>
            <Text style={tw`text-base`}>Select all</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default MenuDropdown;
