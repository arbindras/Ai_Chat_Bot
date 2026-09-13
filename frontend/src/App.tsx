import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

// Route-level code splitting: Home/Login visitors never have to download
// the Chat page's markdown + syntax-highlighting weight up front.
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <CircularProgress size={24} />
  </Box>
);

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <Header />
      <Box
        component="main"
        sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Chat.tsx itself redirects to /login if not authenticated —
                keeping the route always registered avoids the old bug where
                a logged-out user hitting /chat saw a 404 instead of being
                sent to log in. */}
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
}

export default App;
