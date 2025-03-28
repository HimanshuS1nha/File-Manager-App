import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";

import StorageCard from "@/components/storage-card";

import { options } from "@/constants/options";

const Home = () => {
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
                    <View key={item.title} style={tw`items-center gap-y-2`}>
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
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={tw`bg-white rounded-t-3xl py-5 px-3 gap-y-4 min-h-full`}>
          <Text style={tw`text-lg font-semibold px-2`}>Recently Opened</Text>
          {/* TODO: Render recently opened files here */}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
