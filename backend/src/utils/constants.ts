export const COOKIE_NAME = "auth_token";

// How long a login session lasts before the cookie expires.
export const TOKEN_EXPIRY = "7d";

// Basic abuse guardrail on the OpenAI-backed endpoint: each caller gets a
// modest number of chat requests per window. Tune to taste.
export const CHAT_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const CHAT_RATE_LIMIT_MAX = 20; // requests per window, per IP
