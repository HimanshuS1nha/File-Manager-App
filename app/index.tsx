import {
  Text,
  View,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { useCallback, useEffect } from "react";
import tw from "twrnc";
import { router, useRootNavigationState } from "expo-router";
import {
  PERMISSIONS,
  request,
  checkMultiple,
  RESULTS,
} from "react-native-permissions";
import {
  checkManagePermission,
  requestManagePermission,
} from "manage-external-storage";
import * as Linking from "expo-linking";

import { useFavourites } from "@/hooks/use-favourites";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const getFavourites = useFavourites((state) => state.getFavourites);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 30) {
        const permissionStatus = await checkMultiple([
          PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]);

        if (
          permissionStatus["android.permission.READ_MEDIA_AUDIO"] !==
          RESULTS.GRANTED
        ) {
          const permission = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
          );
          if (permission !== RESULTS.GRANTED) {
            return false;
          }
        }

        if (
          permissionStatus["android.permission.READ_MEDIA_IMAGES"] !==
          RESULTS.GRANTED
        ) {
          const permission = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          );
          if (permission !== RESULTS.GRANTED) {
            return false;
          }
        }

        if (
          permissionStatus["android.permission.READ_MEDIA_VIDEO"] !==
          RESULTS.GRANTED
        ) {
          const permission = await request(
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
          );
          if (permission !== RESULTS.GRANTED) {
            return false;
          }
        }

        const manageExternalStoragePermission = await checkManagePermission();
        if (!manageExternalStoragePermission) {
          const permission = await requestManagePermission();
          if (!permission) {
            return false;
          }
        }
      } else {
        const permissionStatus = await checkMultiple([
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          permissionStatus["android.permission.READ_EXTERNAL_STORAGE"] !==
          RESULTS.GRANTED
        ) {
          const readPermission = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          );
          if (readPermission !== RESULTS.GRANTED) {
            return false;
          }
        }

        if (
          permissionStatus["android.permission.WRITE_EXTERNAL_STORAGE"] !==
          RESULTS.GRANTED
        ) {
          const writePermission = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          );
          if (writePermission !== RESULTS.GRANTED) {
            return false;
          }
        }
      }
    }

    return true;
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (rootNavigationState?.key) {
      requestPermission()
        .then((res) => {
          if (res) {
            getFavourites();
            timeout = setTimeout(() => {
              router.replace("/home");
            }, 500);
          } else {
            Alert.alert(
              "Error",
              "This permission is required for the app to work",
              [
                {
                  text: "Exit",
                  onPress: BackHandler.exitApp,
                },
                {
                  text: "Ok",
                  onPress: Linking.openSettings,
                },
              ]
            );
          }
        })
        .catch(() => {
          Alert.alert("Error", "Error occured while checking permissions");
        });
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [rootNavigationState?.key]);
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
