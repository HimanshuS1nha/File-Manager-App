import { create } from "zustand";

type UseFilePreviewDropdownType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  position: { left: number; top: number };
  setPosition: (position: { left: number; top: number }) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (selectedFilePath: string | null) => void;
};

export const useFilePreviewDropdown = create<UseFilePreviewDropdownType>(
  (set) => ({
    isVisible: false,
    setIsVisible: (isVisible) => set({ isVisible }),
    position: { left: 0, top: 0 },
    setPosition: (position) => set({ position }),
    selectedFilePath: null,
    setSelectedFilePath: (selectedFilePath) => set({ selectedFilePath }),
  })
);
