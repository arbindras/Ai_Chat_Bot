import { createTheme, type ThemeOptions } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

// A single accent (indigo-blue) carried across both modes, so light/dark
// feel like the same product rather than two different themes.
const ACCENT = "#5B6EF5";
const ACCENT_DARK = "#4C5CD6";

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: ACCENT,
      dark: ACCENT_DARK,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8B93A7",
    },
    error: { main: "#F0576B" },
    ...(mode === "dark"
      ? {
          background: {
            default: "#0B0D13",
            paper: "#12141D",
          },
          text: {
            primary: "#F2F3F7",
            secondary: "#9199AF",
          },
          divider: "rgba(255,255,255,0.08)",
        }
      : {
          background: {
            default: "#F6F6FA",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#14161F",
            secondary: "#5B5F70",
          },
          divider: "rgba(20,22,31,0.08)",
        }),
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const buildTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
