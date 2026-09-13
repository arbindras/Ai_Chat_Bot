import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 4,
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Built by Arbindra
      </Typography>
    </Box>
  );
};

export default Footer;
