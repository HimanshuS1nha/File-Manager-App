import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";

import StorageCard from "@/components/storage-card";

const Home = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={tw`p-5 gap-y-6`}>
        <StorageCard />
      </View>
    </ScrollView>
  );
};

export default Home;
