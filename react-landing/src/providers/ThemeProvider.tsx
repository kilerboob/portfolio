import { useEffect, useMemo, useState } from "react";
import { ThemeCtx } from "./ThemeContext.tsx";

export type Theme = 'light' | 'dark';
type Ctx = { theme: Theme; toggle: () => void; set: (t: Theme) => void };

const KEY = "app.theme";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        const v = e.newValue as Theme;
        if (v === 'light' || v === 'dark') setTheme(v);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    theme,
    toggle: () => setTheme((t: Theme) => (t === 'dark' ? 'light' : 'dark')),
    set: setTheme,
  }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
 
