import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FileOrFolderType } from "@/types";

type UseFavouritesType = {
  favourites: FileOrFolderType[];
  updateFavourites: (favourite: FileOrFolderType) => void;
};

export const useFavourites = create<UseFavouritesType>()(
  persist(
    (set) => ({
      favourites: [],
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

          return { favourites: Array.from(favouritesMap.values()) };
        });
      },
    }),
    {
      name: "favourites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
