import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";

export const options = [
  [
    {
      Icon: FontAwesome5,
      iconName: "images",
      title: "Images",
      url: "/files",
      params: {
        type: ["jpeg", "png", "gif", "webp"],
        title: "Images",
      },
    },
    {
      Icon: Entypo,
      iconName: "folder-video",
      title: "Videos",
      url: "/files",
      params: {
        type: ["mp4"],
        title: "Videos",
      },
    },
    {
      Icon: FontAwesome5,
      iconName: "music",
      title: "Audio",
      url: "/files",
      params: {
        type: ["mp3"],
        title: "Audio",
      },
    },
    {
      Icon: FontAwesome,
      iconName: "file",
      title: "Documents",
      url: "/folders",
      params: {
        title: "Documents",
      },
    },
  ],
  [
    {
      Icon: AntDesign,
      iconName: "android1",
      title: "Apk",
      url: "/files",
      params: {
        type: ["apk"],
        title: "Apk",
      },
    },
    {
      Icon: FontAwesome,
      iconName: "file-zip-o",
      title: "Zip",
      url: "/files",
      params: {
        type: ["zip"],
        title: "Zip",
      },
    },
    {
      Icon: FontAwesome,
      iconName: "download",
      title: "Downloads",
      url: "/folders",
      params: {
        title: "Download",
      },
    },
    {
      Icon: FontAwesome,
      iconName: "star",
      title: "Favourites",
      url: "/favourites",
    },
  ],
];
