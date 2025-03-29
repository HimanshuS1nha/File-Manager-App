import { create } from "zustand";

import type { FileOrFolderType } from "@/types";

type UseSelectedFile = {
  selectedFile: FileOrFolderType | null;
  setSelectedFile: (selectedFile: FileOrFolderType | null) => void;
};

export const useSelectedFile = create<UseSelectedFile>((set) => ({
  selectedFile: null,
  setSelectedFile: (selectedFile) => set({ selectedFile }),
}));
