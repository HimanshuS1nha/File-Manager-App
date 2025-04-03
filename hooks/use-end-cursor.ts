import { create } from "zustand";

type UseEndCursorType = {
  endCursor: string | undefined;
  setEndCursor: (endCursor: string | undefined) => void;
};

export const useEndCursor = create<UseEndCursorType>((set) => ({
  endCursor: undefined,
  setEndCursor: (endCursor) => set({ endCursor }),
}));
