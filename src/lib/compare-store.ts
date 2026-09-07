import { create } from "zustand";
import { persist } from "zustand/middleware";

import { COMPARE_LIMIT } from "@/contracts/compare";

export const COMPARE_STORAGE_KEY = "homeland.compare";

type ToggleResult = { ok: true } | { ok: false; reason: "full" };

type CompareState = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => ToggleResult;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) => {
        const ids = get().ids;

        if (ids.includes(id)) {
          set({ ids: ids.filter((value) => value !== id) });
          return { ok: true };
        }

        if (ids.length >= COMPARE_LIMIT) {
          return { ok: false, reason: "full" };
        }

        set({ ids: [...ids, id] });
        return { ok: true };
      },
      remove: (id) => set({ ids: get().ids.filter((value) => value !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: COMPARE_STORAGE_KEY },
  ),
);
