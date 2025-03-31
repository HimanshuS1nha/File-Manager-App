import { create } from "zustand";

type UseFileDropdownType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useFileDropdown = create<UseFileDropdownType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
