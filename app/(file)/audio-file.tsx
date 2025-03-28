import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import tw from "twrnc";
import SoundPlayer from "react-native-sound-player";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useQuery } from "@tanstack/react-query";

import { useSelectedFile } from "@/hooks/use-selected-file";

const AudioFile = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);

  const [isPlaying, setIsPlaying] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: [`get-audio-info-${selectedFile!.uri}`],
    queryFn: async () => {
      const data = await SoundPlayer.getInfo();
      return data;
    },
    refetchInterval: 1000,
  });

  const parseDuration = useCallback((value: number) => {
    return `${Math.floor(value / 60)}:${
      Math.ceil(value % 60).toString().length === 1
        ? "0" + Math.ceil(value % 60).toString()
        : Math.ceil(value % 60)
    }`;
  }, []);

  const handleSeekTo = useCallback(async (value: number) => {
    SoundPlayer.seek(value);
  }, []);

  useEffect(() => {
    SoundPlayer.playUrl(selectedFile!.uri);

    return () => {
      SoundPlayer.stop();
    };
  }, []);

  return (
    <View style={tw`flex-1 bg-black justify-center items-center gap-y-6 px-2`}>
      <View
        style={tw`border border-gray-300 rounded-full p-2 items-center justify-center`}
      >
        <Ionicons name="musical-note" size={120} color={"#9333EA"} />
      </View>

      <Text style={tw`text-2xl font-medium text-white`}>
        {selectedFile!.name}
      </Text>

      <View style={tw`flex-row gap-x-3 items-center`}>
        <Text style={tw`text-white text-xs font-medium`}>
          {isLoading ? (
            <ActivityIndicator color={"white"} size={14} />
          ) : (
            parseDuration(data?.currentTime ?? 0)
          )}
        </Text>
        <Slider
          style={tw`flex-1 h-20`}
          minimumValue={0}
          value={data?.currentTime}
          maximumValue={data?.duration}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#D1D5DB"
          onValueChange={handleSeekTo}
        />
        <Text style={tw`text-white text-xs font-medium`}>
          {isLoading ? (
            <ActivityIndicator color={"white"} size={14} />
          ) : (
            parseDuration(data?.duration ?? 0)
          )}
        </Text>
      </View>

      <View style={tw`flex-row items-center justify-center gap-x-7`}>
        <Pressable
          style={tw`bg-white p-2 rounded-full`}
          onPress={() => {
            if (isPlaying) {
              SoundPlayer.pause();
              setIsPlaying(false);
            } else {
              SoundPlayer.play();
              setIsPlaying(true);
            }
          }}
        >
          {isPlaying ? (
            <AntDesign name="pause" size={40} color="black" />
          ) : (
            <Entypo name="controller-play" size={40} color="black" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default AudioFile;
