import { createContext, useContext } from "react";

export type Theme = "light" | "dark";
export type Ctx = { theme: Theme; toggle: () => void; set: (t: Theme) => void };

export const ThemeCtx = createContext<Ctx | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
};
