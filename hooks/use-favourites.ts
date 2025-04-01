import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FileOrFolderType } from "@/types";

type UseFavouritesType = {
  favourites: FileOrFolderType[];
  updateFavourites: (favourite: FileOrFolderType) => void;
  contains: (file: FileOrFolderType) => boolean;
  renameFile: (filePath: string, newName: string, newPath: string) => void;
};

export const useFavourites = create<UseFavouritesType>()(
  persist(
    (set, get) => ({
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
      contains: (file) => {
        return !!get().favourites.find((favourite) => favourite.id === file.id);
      },
      renameFile: (filePath, newName, newPath) => {
        set((prev) => {
          const newFavourites = prev.favourites.map((favourite) => {
            if (favourite.path === filePath) {
              return {
                ...favourite,
                name: newName,
                path: newPath,
                uri: `file://${newPath}`,
              };
            }
            return favourite;
          });

          return { favourites: newFavourites };
        });
      },
    }),
    {
      name: "favourites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
