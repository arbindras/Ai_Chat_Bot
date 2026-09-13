import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FiArrowRight, FiZap, FiShield, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer/Footer";

const features = [
  {
    icon: <FiZap size={20} />,
    title: "Streamed replies",
    text: "Answers appear as they're generated, not after a long wait.",
  },
  {
    icon: <FiMessageCircle size={20} />,
    title: "Real conversations",
    text: "Your chat history is saved, so you can pick up where you left off.",
  },
  {
    icon: <FiShield size={20} />,
    title: "Private by default",
    text: "Each account only ever sees its own conversation history.",
  },
];

// A purely decorative, CSS-only preview of the chat UI — soft gradient
// blobs behind a mock exchange. No image assets involved.
const HeroPreview = () => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      maxWidth: 380,
      mx: "auto",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: -40,
        zIndex: 0,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(closest-side, rgba(124,140,255,0.35), transparent), radial-gradient(closest-side, rgba(76,92,214,0.25), transparent 70%)"
            : "radial-gradient(closest-side, rgba(124,140,255,0.35), transparent), radial-gradient(closest-side, rgba(76,92,214,0.18), transparent 70%)",
        backgroundPosition: "20% 20%, 80% 80%",
        backgroundRepeat: "no-repeat",
        filter: "blur(10px)",
        "@keyframes drift": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        animation: "drift 7s ease-in-out infinite",
      }}
    />
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        p: 2.5,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 20px 60px rgba(0,0,0,0.45)"
            : "0 20px 60px rgba(30,30,60,0.12)",
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            alignSelf: "flex-end",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 3,
            borderBottomRightRadius: 4,
            px: 2,
            py: 1,
            maxWidth: "80%",
            fontSize: 14,
          }}
        >
          Summarize this for me?
        </Box>
        <Box
          sx={{
            alignSelf: "flex-start",
            bgcolor: "action.hover",
            borderRadius: 3,
            borderBottomLeftRadius: 4,
            px: 2,
            py: 1,
            maxWidth: "85%",
            fontSize: 14,
          }}
        >
          Sure — here's the short version{" "}
          <Box component="span" className="stream-cursor" />
        </Box>
      </Stack>
    </Box>
  </Box>
);

const Home = () => {
  const auth = useAuth();

  return (
    <Box sx={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 6, md: 4 },
          maxWidth: 1100,
          width: "100%",
          mx: "auto",
          px: 3,
          pt: { xs: 6, md: 10 },
          pb: 8,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Chip
            label="Built with the OpenAI API"
            size="small"
            sx={{ mb: 2.5, fontWeight: 600 }}
          />
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "2.2rem", md: "2.9rem" }, mb: 2 }}
          >
            Ask anything. Get answers, instantly.
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400, mb: 4, maxWidth: 460 }}
          >
            A fast, streaming chat interface — your conversations are saved
            to your account and picked up right where you left them.
          </Typography>
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Button
              component={Link}
              to={auth?.isLoggedIn ? "/chat" : "/signup"}
              variant="contained"
              size="large"
              endIcon={<FiArrowRight />}
            >
              {auth?.isLoggedIn ? "Go to chat" : "Get started"}
            </Button>
            {!auth?.isLoggedIn && (
              <Button component={Link} to="/login" variant="text" size="large">
                Log in
              </Button>
            )}
          </Stack>
        </Box>

        <Box sx={{ flex: 1, width: "100%", py: { xs: 2, md: 0 } }}>
          <HeroPreview />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1100,
          width: "100%",
          mx: "auto",
          px: 3,
          pb: 10,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
        }}
      >
        {features.map((f) => (
          <Box
            key={f.title}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ color: "primary.main", mb: 1.5 }}>{f.icon}</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {f.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {f.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
