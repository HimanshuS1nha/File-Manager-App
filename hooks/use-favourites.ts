import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FileOrFolderType } from "@/types";

type UseFavouritesType = {
  favourites: FileOrFolderType[];
  getFavourites: () => Promise<void>;
  updateFavourites: (favourite: FileOrFolderType) => void;
};

export const useFavourites = create<UseFavouritesType>((set) => ({
  favourites: [],
  getFavourites: async () => {
    const favourites = await AsyncStorage.getItem("favourites");
    if (favourites) {
      set({ favourites: JSON.parse(favourites) });
    }
  },
  updateFavourites: (favourite) => {
    set((prev) => {
      const favouritesMap = new Map(
        prev.favourites.map((item) => [item.id, item])
      );

      if (favouritesMap.has(favourite.id)) {
        favouritesMap.delete(favourite.id);
      } else {
        favouritesMap.set(favourite.id, favourite);
      }

      const newFavourites = Array.from(favouritesMap.values());

      AsyncStorage.setItem("favourites", JSON.stringify(newFavourites));

      return { favourites: newFavourites };
    });
  },
}));
