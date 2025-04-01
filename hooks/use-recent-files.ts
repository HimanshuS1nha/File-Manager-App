import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FileOrFolderType } from "@/types";

type UseRecentFilesType = {
  recentFiles: FileOrFolderType[];
  updateRecentFiles: (file: FileOrFolderType) => void;
  removeFromRecentFiles: (file: FileOrFolderType) => void;
  contains: (file: FileOrFolderType) => boolean;
  renameFile: (filePath: string, newName: string, newPath: string) => void;
};

export const useRecentFiles = create<UseRecentFilesType>()(
  persist(
    (set, get) => ({
      recentFiles: [],
      updateRecentFiles: (file) => {
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
      removeFromRecentFiles: (file) => {
        set((prev) => {
          const newRecentFiles = prev.recentFiles.filter(
            (recentFile) => recentFile.id !== file.id
          );
          return { recentFiles: newRecentFiles };
        });
      },
      contains: (file) => {
        return !!get().recentFiles.find(
          (recentFile) => recentFile.id === file.id
        );
      },
      renameFile: (filePath, newName, newPath) => {
        set((prev) => {
          const newRecentFiles = prev.recentFiles.map((recentFile) => {
            if (recentFile.path === filePath) {
              return {
                ...recentFile,
                name: newName,
                path: newPath,
                uri: `file://${newPath}`,
              };
            }
            return recentFile;
          });

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
