import React, { createContext, useContext, useMemo, useState } from "react";
import type { Drop } from "../types";
import type { Gift } from "../constants/gifts";
import type { ThemeKey } from "../theme/themes";

export interface Draft {
  name: string;
  age: number;
  message: string;
  themeKey: ThemeKey;
  photoUri: string | null; // local device uri, pre-upload
  memoryPhotoUris: (string | null)[];
}

const DEFAULT_DRAFT: Draft = {
  name: "Aisha",
  age: 24,
  message:
    "Another year of being effortlessly extra. Here's to more chaos, more laughs, and more cake than any one person should eat in a single sitting. So glad you exist.",
  themeKey: "star",
  photoUri: null,
  memoryPhotoUris: [null, null, null],
};

interface DropContextValue {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  drop: Drop | null;
  setDrop: (drop: Drop | null) => void;
  selectedGift: Gift | null;
  setSelectedGift: (gift: Gift | null) => void;
  reset: () => void;
}

const DropContext = createContext<DropContextValue | undefined>(undefined);

export function DropProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [drop, setDrop] = useState<Drop | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      drop,
      setDrop,
      selectedGift,
      setSelectedGift,
      reset: () => {
        setDrop(null);
        setSelectedGift(null);
      },
    }),
    [draft, drop, selectedGift]
  );

  return <DropContext.Provider value={value}>{children}</DropContext.Provider>;
}

export function useDrop() {
  const ctx = useContext(DropContext);
  if (!ctx) throw new Error("useDrop must be used within a DropProvider");
  return ctx;
}
