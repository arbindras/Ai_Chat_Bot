import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "./shared/Logo";
import NavigationLink from "./shared/NavigationLink";
import ThemeToggle from "./shared/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const auth = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ display: "flex", gap: 0.5 }}>
        <Logo />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink to="/chat" text="Chat" variant="primary" />
              <NavigationLink to="/" text="Log out" onClick={auth.logout} />
            </>
          ) : (
            <>
              <NavigationLink to="/login" text="Log in" />
              <NavigationLink to="/signup" text="Sign up" variant="primary" />
            </>
          )}
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
