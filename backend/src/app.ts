import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import appRouter from "./routes/index.js";

config();

const app = express();

// Comma-separated list of allowed frontend origins, e.g.
// "https://your-app.vercel.app,http://localhost:5173"
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no Origin header (curl, server-to-server, some
      // mobile clients) are allowed through; browser requests are checked
      // against the allow-list above.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1", appRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "AI Chat backend is running" });
});

export default app;
