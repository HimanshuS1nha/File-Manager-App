import { create } from "zustand";

type UseCreateFolderModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useCreateFolderModal = create<UseCreateFolderModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
