import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FileOrFolderType } from "@/types";

type UseRecentFilesType = {
  recentFiles: FileOrFolderType[];
  updateRecentFiles: (file: FileOrFolderType) => Promise<void>;
};

export const useRecentFiles = create<UseRecentFilesType>()(
  persist(
    (set) => ({
      recentFiles: [],
      updateRecentFiles: async (file) => {
        set((prev) => {
          const fileIndex = prev.recentFiles.findIndex(
            (recentFile) => recentFile.id === file.id
          );

          let newRecentFiles: FileOrFolderType[];

          if (fileIndex !== -1) {
            if (fileIndex === 0) {
              newRecentFiles = prev.recentFiles;
            } else {
              const existingFile = prev.recentFiles[fileIndex];
              newRecentFiles = [
                existingFile,
                ...prev.recentFiles.filter((_, i) => i !== fileIndex),
              ];
            }
          } else {
            newRecentFiles = [file, ...prev.recentFiles];
            if (newRecentFiles.length > 10) {
              newRecentFiles = newRecentFiles.slice(0, 10);
            }
          }

          return { recentFiles: newRecentFiles };
        });
      },
    }),
    {
      name: "recent-files",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
