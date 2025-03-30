import { create } from "zustand";

type UseMenuDropdownType = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const useMenuDropdown = create<UseMenuDropdownType>((set) => ({
  isVisible: false,
  setIsVisible: (isVisible) => set({ isVisible }),
}));
