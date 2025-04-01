import { create } from "zustand";

type UseFileInfoModalType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useFileInfoModal = create<UseFileInfoModalType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
