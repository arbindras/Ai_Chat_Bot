import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Lazily creates a single shared OpenAI client. Lazy so that the app can
 * still boot (and other routes still work) even if OPENAI_API_KEY is
 * temporarily missing — the error only surfaces when a chat is attempted.
 */
export const getOpenAIClient = (): OpenAI => {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the environment");
  }

  client = new OpenAI({
    apiKey,
    organization: process.env.OPENAI_ORGANIZATION_ID || undefined,
  });
  return client;
};

// Which chat model to call. Kept as a single env-driven constant so it's a
// one-line change as OpenAI's lineup moves — no code changes required.
export const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";
