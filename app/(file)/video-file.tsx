import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { useVideoPlayer, VideoView } from "expo-video";

import { useSelectedFile } from "@/hooks/use-selected-file";

const VideoFile = () => {
  const selectedFile = useSelectedFile((state) => state.selectedFile);

  const player = useVideoPlayer(selectedFile!.uri, (player) => {
    player.play();
    player.muted = false;
  });
  return (
    <View style={tw`flex-1 bg-black justify-center items-center`}>
      <VideoView player={player} style={tw`w-full h-[60%]`} />
    </View>
  );
};

export default VideoFile;
