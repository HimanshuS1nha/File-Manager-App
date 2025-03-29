import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import StorageCard from "@/components/storage-card";
import FilePreview from "@/components/file-preview";

import { useRecentFiles } from "@/hooks/use-recent-files";

import { options } from "@/constants/options";

const Home = () => {
  const recentFiles = useRecentFiles((state) => state.recentFiles);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={tw`p-5 gap-y-6`}>
        <StorageCard />

        <View style={tw`gap-5`}>
          {options.map((option, i) => {
            return (
              <View key={i} style={tw`flex-row justify-between items-center`}>
                {option.map((item) => {
                  return (
                    <Pressable
                      key={item.title}
                      style={tw`items-center gap-y-2`}
                      onPress={() => {
                        if (item.params) {
                          router.push({
                            pathname: item.url as never,
                            params: item.params,
                          });
                        } else {
                          router.push(item.url as never);
                        }
                      }}
                    >
                      <View
                        style={tw`size-16 items-center justify-center bg-white rounded-lg shadow-lg shadow-white`}
                      >
                        <item.Icon
                          name={item.iconName}
                          size={30}
                          color="#4F46E5"
                        />
                      </View>
                      <Text style={tw`font-medium`}>{item.title}</Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={tw`bg-white rounded-t-3xl py-5 px-3 gap-y-4 min-h-full`}>
          <Text style={tw`text-lg font-semibold px-2`}>Recently Opened</Text>
          {recentFiles.length > 0 ? (
            <FlashList
              data={recentFiles}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                return <FilePreview file={item} />;
              }}
              estimatedItemSize={10}
            />
          ) : (
            <View style={tw`items-center`}>
              <Text style={tw`text-rose-600 font-semibold`}>
                No data to show.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
