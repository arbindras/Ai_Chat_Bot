import { Request, Response } from "express";
import User from "../models/User.js";
import { getOpenAIClient, CHAT_MODEL } from "../config/openai-config.js";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Streams a chat completion back to the client over Server-Sent Events so
 * the UI can render the reply token-by-token instead of waiting for the
 * whole response to finish generating.
 *
 * Event shapes written to the stream:
 *   {"delta": "..."}         - a chunk of the assistant's reply
 *   {"done": true}           - stream finished and was saved
 *   {"error": "..."}         - something went wrong; stream ends after this
 */
export const generateChatCompletion = async (req: Request, res: Response) => {
  const { message } = req.body as { message: string };

  let user;
  try {
    user = await User.findById(res.locals.jwtData.id);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!user) {
    return res
      .status(401)
      .json({ message: "User not registered OR token malformed" });
  }

  // Build the message history for OpenAI, then record the user's new
  // message right away so it isn't lost even if the model call fails.
  const history: ChatMessage[] = user.chats.map(({ role, content }) => ({
    role: role as ChatMessage["role"],
    content,
  }));
  history.push({ role: "user", content: message });
  user.chats.push({ role: "user", content: message });
  await user.save();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let assistantReply = "";
  let clientClosed = false;
  req.on("close", () => {
    clientClosed = true;
  });

  try {
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: history,
      stream: true,
    });

    for await (const chunk of stream) {
      if (clientClosed) break;
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        assistantReply += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    if (!clientClosed) {
      if (assistantReply.trim().length > 0) {
        user.chats.push({ role: "assistant", content: assistantReply });
        await user.save();
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error(error);
    if (!clientClosed) {
      res.write(
        `data: ${JSON.stringify({
          error: "Something went wrong generating a response.",
        })}\n\n`
      );
      res.end();
    }
  }
};

export const sendChatsToUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token malformed" });
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteChats = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token malformed" });
    }
    user.chats.splice(0, user.chats.length);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
