import { Text, View, ActivityIndicator, Image } from "react-native";
import tw from "twrnc";

export default function Index() {
  return (
    <View style={tw`flex-1 bg-indigo-600 items-center justify-center gap-y-8`}>
      <Image
        source={require("../assets/images/logo.png")}
        style={tw`size-40 rounded-lg`}
      />

      <View style={tw`gap-y-4 w-[70%] items-center`}>
        <Text style={tw`text-white text-3xl font-medium text-center`}>
          Manage your files in a simple way
        </Text>
        <Text style={tw`text-gray-200 text-center`}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio alias
        </Text>
      </View>

      <ActivityIndicator size={40} color={"#fff"} />
    </View>
  );
}
