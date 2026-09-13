import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
} from "../controllers/chat-controllers.js";
import {
  CHAT_RATE_LIMIT_MAX,
  CHAT_RATE_LIMIT_WINDOW_MS,
} from "../utils/constants.js";

// Guards against runaway OpenAI spend from a stuck frontend loop or a
// scripted abuser — not a substitute for per-user billing limits, but a
// cheap first line of defense.
const chatLimiter = rateLimit({
  windowMs: CHAT_RATE_LIMIT_WINDOW_MS,
  max: CHAT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many chat requests — please slow down." },
});

const chatRoutes = Router();

chatRoutes.post(
  "/new",
  chatLimiter,
  verifyToken,
  validate(chatCompletionValidator),
  generateChatCompletion
);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;
