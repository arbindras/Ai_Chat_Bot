import { IconButton, Tooltip } from "@mui/material";
import { FiSun, FiMoon } from "react-icons/fi";
import { useThemeMode } from "../../context/ThemeModeContext";

const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();
  return (
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle color mode">
        {mode === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
