import { create } from "zustand";

type UseCreateZipModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useCreateZipModal = create<UseCreateZipModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
