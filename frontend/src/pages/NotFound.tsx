import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        py: 10,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "4rem", sm: "6rem" },
          fontWeight: 800,
          background: "linear-gradient(135deg, #7C8CFF, #4C5CD6)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          lineHeight: 1,
        }}
      >
        404
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        This page doesn't exist
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for may have been moved or removed.
      </Typography>
      <Button component={Link} to="/" variant="contained" startIcon={<FiArrowLeft />}>
        Back home
      </Button>
    </Box>
  );
};

export default NotFound;
