import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: () => void; set: (t: Theme) => void };

const Ctx = createContext<ThemeCtx>({ theme: "light", toggle: () => {}, set: () => {} });

function readTheme(): Theme {
  try {
    const v = localStorage.getItem("theme");
    if (v === "dark" || v === "light") return v;
  } catch { /* ignore */ }
  // prefer system
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark";
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const value = useMemo<ThemeCtx>(() => ({
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    set: (t: Theme) => setTheme(t),
  }), [theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const useTheme = () => useContext(Ctx);
export default { ThemeProvider, useTheme };
