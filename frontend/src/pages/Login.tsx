import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { FiLogIn } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import CustomizedInput from "../components/shared/CustomizedInput";
import BrandMark from "../components/shared/BrandMark";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setSubmitting(true);
    try {
      await auth?.login(email, password);
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (auth?.user) navigate("/chat");
  }, [auth?.user, navigate]);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        variant="outlined"
        sx={{ p: { xs: 3, sm: 5 }, width: "100%", maxWidth: 440, borderRadius: 4 }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
          <BrandMark size={40} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Log in to continue your conversation
          </Typography>
        </Stack>

        <CustomizedInput type="email" name="email" label="Email" />
        <CustomizedInput type="password" name="password" label="Password" />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={submitting}
          endIcon={<FiLogIn />}
          sx={{ mt: 2, maxWidth: 400 }}
        >
          {submitting ? "Logging in…" : "Log in"}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          Don't have an account?{" "}
          <Box component={Link} to="/signup" sx={{ color: "primary.main", fontWeight: 600 }}>
            Sign up
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
