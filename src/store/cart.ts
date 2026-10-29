"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addLine, setQuantity } from "@/lib/cart";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: CartLine) => void;
  update: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: (line) => set((s) => ({ lines: addLine(s.lines, line), open: true })),
      update: (variantId, quantity) => set((s) => ({ lines: setQuantity(s.lines, variantId, quantity) })),
      remove: (variantId) => set((s) => ({ lines: setQuantity(s.lines, variantId, 0) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "bgod-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);
