import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressCircle } from "react-native-svg-charts";
import * as FileSystem from "expo-file-system";
import { useQuery } from "@tanstack/react-query";

const StorageCard = () => {
  const { data: totalSpace, isLoading: totalSpaceLoading } = useQuery({
    queryKey: ["get-total-space"],
    queryFn: async () => {
      const totalSpaceInBytes = await FileSystem.getTotalDiskCapacityAsync();

      return (totalSpaceInBytes / 1073741824).toFixed(2);
    },
  });

  const { data: freeSpace, isLoading: freeSpaceLoading } = useQuery({
    queryKey: ["get-free-space"],
    queryFn: async () => {
      const freeSpaceInBytes = await FileSystem.getFreeDiskStorageAsync();
      return (freeSpaceInBytes / 1073741824).toFixed(2);
    },
  });
  return (
    <View style={tw`bg-indigo-600 p-4 rounded-lg gap-y-3`}>
      <Text style={tw`text-white text-base font-medium`}>Internal Storage</Text>

      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-row gap-x-2 items-center`}>
          <MaterialIcons name="sd-storage" size={46} color="white" />
          {totalSpaceLoading || freeSpaceLoading ? (
            <ActivityIndicator color={"white"} size={18} />
          ) : (
            <View style={tw`gap-y-1`}>
              <Text style={tw`text-white font-medium`}>{freeSpace} GB</Text>
              <Text style={tw`text-gray-200 font-medium`}>
                Total: {totalSpace} GB
              </Text>
            </View>
          )}
        </View>

        {freeSpace && totalSpace && (
          <ProgressCircle
            progress={
              (parseInt(totalSpace) - parseInt(freeSpace)) /
              parseInt(totalSpace)
            }
            progressColor="#fe713c"
            backgroundColor="#21e09e"
            style={tw`size-20`}
            strokeWidth={15}
          />
        )}
      </View>

      <View style={tw`gap-y-3`}>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <View style={tw`size-4 rounded-md bg-[#fe713c]`} />
          <Text style={tw`text-white`}>Used</Text>
        </View>
        <View style={tw`flex-row gap-x-3 items-center`}>
          <View style={tw`size-4 rounded-md bg-[#21e09e]`} />
          <Text style={tw`text-white`}>Available</Text>
        </View>
      </View>
    </View>
  );
};

export default StorageCard;
