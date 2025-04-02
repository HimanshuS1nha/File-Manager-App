import { create } from "zustand";

import type { FileOrFolderType } from "@/types";

type UseSelectedItemsType = {
  selectedItems: FileOrFolderType[];
  updateSelectedItems: (selectedItem: FileOrFolderType) => void;
  clearSelectedItems: () => void;
  setSelectedItems: (selectedItems: FileOrFolderType[]) => void;
};

export const useSelectedItems = create<UseSelectedItemsType>((set) => ({
  selectedItems: [],
  updateSelectedItems: (selectedItem) => {
    set((prev) => {
      const selectedItemsMap = new Map(
        prev.selectedItems.map((item) => [item.id, item])
      );

      if (selectedItemsMap.has(selectedItem.id)) {
        selectedItemsMap.delete(selectedItem.id);
      } else {
        selectedItemsMap.set(selectedItem.id, selectedItem);
      }

      return { selectedItems: Array.from(selectedItemsMap.values()) };
    });
  },
  clearSelectedItems: () => set({ selectedItems: [] }),
  setSelectedItems: (selectedItems) => set({ selectedItems }),
}));
