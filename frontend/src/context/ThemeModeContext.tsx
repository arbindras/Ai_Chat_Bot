import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { buildTheme } from "../theme";

type ThemeModeContextType = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

const STORAGE_KEY = "chat-app-theme-mode";

const getInitialMode = (): PaletteMode => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
};
