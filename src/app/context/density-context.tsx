import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type GlobalDensity = "compact" | "comfortable" | "spacious";

interface DensityContextType {
  density: GlobalDensity;
  setDensity: (density: GlobalDensity) => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<GlobalDensity>("comfortable");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cco-global-density");
    if (saved && ["compact", "comfortable", "spacious"].includes(saved)) {
      setDensityState(saved as GlobalDensity);
    }
  }, []);

  // Save to localStorage when changed
  const setDensity = (newDensity: GlobalDensity) => {
    setDensityState(newDensity);
    localStorage.setItem("cco-global-density", newDensity);
  };

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error("useDensity must be used within DensityProvider");
  }
  return context;
}

// Helper classes for each density level
export const densityClasses = {
  compact: {
    padding: "px-3 py-1.5",
    text: "text-xs",
    avatar: "h-8 w-8",
    gap: "gap-2",
    spacing: "space-y-1",
  },
  comfortable: {
    padding: "px-4 py-3",
    text: "text-sm",
    avatar: "h-10 w-10",
    gap: "gap-3",
    spacing: "space-y-2",
  },
  spacious: {
    padding: "px-6 py-4",
    text: "text-base",
    avatar: "h-12 w-12",
    gap: "gap-4",
    spacing: "space-y-3",
  },
};
