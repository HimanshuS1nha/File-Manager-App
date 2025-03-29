import { View, Text, Pressable, Modal } from "react-native";
import React from "react";
import tw from "twrnc";

import { useSelectedItems } from "@/hooks/use-selected-items";

const MenuDropdown = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);
  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <Pressable style={tw`flex-1`} onPress={() => setIsVisible(false)}>
        <View
          style={tw`absolute right-2 top-[6%] bg-white shadow-lg shadow-black p-4 rounded-lg justify-center w-[40%] gap-y-5`}
        >
          {selectedItems.length > 0 ? (
            <>
              <Pressable>
                <Text style={tw`text-base`}>Move to</Text>
              </Pressable>
              <Pressable>
                <Text style={tw`text-base`}>Copy to</Text>
              </Pressable>
              <Pressable>
                <Text style={tw`text-base`}>Add to Zip</Text>
              </Pressable>
            </>
          ) : (
            <Pressable>
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
