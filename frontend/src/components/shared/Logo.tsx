import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import BrandMark from "./BrandMark";

const Logo = () => {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        marginRight: "auto",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <BrandMark size={30} />
      <Typography
        sx={{
          display: { xs: "none", sm: "block" },
          fontWeight: 800,
          fontSize: "1.05rem",
          letterSpacing: "-0.01em",
        }}
      >
        Arbindra's AI Chat
      </Typography>
    </Box>
  );
};

export default Logo;
