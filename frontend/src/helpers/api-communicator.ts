import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const errorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; errors?: { msg?: string }[] }
      | undefined;
    return data?.message || data?.errors?.[0]?.msg || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post("/user/login", { email, password });
    return res.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to log in"), { cause: error });
  }
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post("/user/signup", { name, email, password });
    return res.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to sign up"), { cause: error });
  }
};

export const checkAuthStatus = async () => {
  try {
    const res = await axios.get("/user/auth-status");
    return res.data;
  } catch {
    // Not being logged in is an expected, silent case here — the caller
    // just treats a null/undefined return as "not authenticated".
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get("/user/logout");
    return res.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to log out"), { cause: error });
  }
};

export const getUserChats = async () => {
  try {
    const res = await axios.get("/chat/all-chats");
    return res.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load chats"), { cause: error });
  }
};

export const deleteUserChats = async () => {
  try {
    const res = await axios.delete("/chat/delete");
    return res.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to delete chats"), { cause: error });
  }
};

export type StreamEvent =
  | { delta: string }
  | { done: true }
  | { error: string };

/**
 * Posts a new chat message and streams the assistant's reply back via
 * Server-Sent Events, invoking `onDelta` as each chunk of text arrives.
 * Uses `fetch` directly (rather than axios) since reading a streamed
 * response body needs the native ReadableStream API.
 */
export const streamChatRequest = async (
  message: string,
  onDelta: (chunk: string) => void
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/new`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok || !response.body) {
    let detail = "Unable to send message";
    try {
      const data = await response.json();
      detail = data?.message || data?.errors?.[0]?.msg || detail;
    } catch {
      // response wasn't JSON — keep the default message
    }
    throw new Error(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separatorIndex: number;
    while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);
      const dataLine = rawEvent
        .split("\n")
        .find((line) => line.startsWith("data: "));
      if (!dataLine) continue;

      const payload: StreamEvent = JSON.parse(dataLine.slice(6));
      if ("error" in payload) {
        throw new Error(payload.error);
      }
      if ("delta" in payload) {
        onDelta(payload.delta);
      }
      if ("done" in payload) {
        return;
      }
    }
  }
};
