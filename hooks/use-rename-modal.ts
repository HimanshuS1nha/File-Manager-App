import { create } from "zustand";

type UseRenameModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (selectedFilePath: string | null) => void;
};

export const useRenameModal = create<UseRenameModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
  selectedFilePath: null,
  setSelectedFilePath: (selectedFilePath) => set({ selectedFilePath }),
}));
