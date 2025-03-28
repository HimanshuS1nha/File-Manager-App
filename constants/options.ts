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
      url: "/images-videos-audio",
      params: {
        type: "Images",
      },
    },
    {
      Icon: Entypo,
      iconName: "folder-video",
      title: "Videos",
      url: "/images-videos-audio",
      params: {
        type: "Videos",
      },
    },
    {
      Icon: FontAwesome5,
      iconName: "music",
      title: "Audio",
      url: "/images-videos-audio",
      params: {
        type: "Audio",
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
        type: "Apk",
      },
    },
    {
      Icon: FontAwesome,
      iconName: "file-zip-o",
      title: "Zip",
      url: "/files",
      params: {
        type: "Zip",
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
