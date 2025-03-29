import { View, Text, Pressable, BackHandler } from "react-native";
import React, { useCallback, useEffect } from "react";
import tw from "twrnc";

import { useSelectedItems } from "@/hooks/use-selected-items";

import { useMenuDropdown } from "@/hooks/use-menu-dropdown";

const MenuDropdown = () => {
  const selectedItems = useSelectedItems((state) => state.selectedItems);

  const { isVisible, setIsVisible } = useMenuDropdown();

  const handleBackPress = useCallback(() => {
    if (isVisible) {
      setIsVisible(false);
    }

    return undefined;
  }, [isVisible]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, []);
  return (
    <>
      {isVisible && (
        <Pressable
          style={tw`flex-1 absolute inset-0`}
          onPress={() => setIsVisible(false)}
        >
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
      )}
    </>
  );
};

export default MenuDropdown;
