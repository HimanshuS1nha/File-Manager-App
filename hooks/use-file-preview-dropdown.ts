import { FileOrFolderType } from "@/types";
import { create } from "zustand";

type UseFilePreviewDropdownType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  position: { left: number; top: number };
  setPosition: (position: { left: number; top: number }) => void;
  selectedFile: FileOrFolderType | null;
  setSelectedFile: (selectedFile: FileOrFolderType | null) => void;
};

export const useFilePreviewDropdown = create<UseFilePreviewDropdownType>(
  (set) => ({
    isVisible: false,
    setIsVisible: (isVisible) => set({ isVisible }),
    position: { left: 0, top: 0 },
    setPosition: (position) => set({ position }),
    selectedFile: null,
    setSelectedFile: (selectedFile) => set({ selectedFile }),
  })
);
