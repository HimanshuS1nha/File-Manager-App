import { View, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Stack } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

const FileLayout = () => {
  return (
    <Stack
      screenOptions={{
        title: "",
        statusBarBackgroundColor: "#000",
        statusBarStyle: "light",
        headerStyle: {
          backgroundColor: "#000",
        },
        headerBackVisible: false,
        headerLeft: () => {
          return (
            <Pressable onPress={router.back}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>
          );
        },
        headerRight: () => {
          return (
            <View style={tw`flex-row gap-x-5 items-center`}>
              <AntDesign name="sharealt" size={24} color="white" />
              <AntDesign name={"staro"} size={24} color="white" />
              <FontAwesome6 name="ellipsis-vertical" size={24} color="white" />
            </View>
          );
        },
      }}
    />
  );
};

export default FileLayout;
