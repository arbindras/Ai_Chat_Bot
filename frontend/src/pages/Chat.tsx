import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import ChatInput from "../components/chat/ChatInput";
import BrandMark from "../components/shared/BrandMark";
import { getInitials } from "../helpers/initials";
import {
  deleteUserChats,
  getUserChats,
  streamChatRequest,
} from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  // Wait for the initial auth check to resolve before deciding whether to
  // bounce to /login — otherwise a logged-in user gets flashed to the
  // login page for a moment on every refresh.
  useEffect(() => {
    if (!auth?.isLoadingUser && !auth?.user) {
      navigate("/login");
    }
  }, [auth?.isLoadingUser, auth?.user, navigate]);

  useEffect(() => {
    if (!auth?.user) return;
    let cancelled = false;
    getUserChats()
      .then((data) => {
        if (!cancelled) setMessages(data?.chats ?? []);
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to load chats"
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [auth?.user]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const handleSend = async (text: string) => {
    isNearBottomRef.current = true;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setIsSending(true);
    try {
      await streamChatRequest(text, (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      // Drop the empty placeholder if nothing came back at all; keep
      // whatever partial text did arrive.
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.content === "") next.pop();
        return next;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = async () => {
    const toastId = toast.loading("Clearing conversation…");
    try {
      await deleteUserChats();
      setMessages([]);
      toast.success("Conversation cleared", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to clear chats",
        { id: toastId }
      );
    }
  };

  if (auth?.isLoadingUser || !auth?.user) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: 260,
          flexShrink: 0,
          p: 3,
          gap: 2,
        }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center", pt: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: "primary.main", fontWeight: 700 }}>
            {getInitials(auth.user.name)}
          </Avatar>
          <Typography sx={{ fontWeight: 700 }}>{auth.user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Ask about anything — knowledge, brainstorming, code, advice. Avoid
            sharing sensitive personal information.
          </Typography>
        </Stack>
        <Button
          onClick={handleClear}
          variant="outlined"
          color="error"
          startIcon={<FiTrash2 />}
          sx={{ mt: "auto" }}
        >
          Clear conversation
        </Button>
      </Box>

      {/* Main column */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          className="scroll-thin"
          sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}
        >
          {loadingHistory ? (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
              <CircularProgress size={22} />
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ textAlign: "center", pt: { xs: 6, md: 10 }, color: "text.secondary" }}>
              <Box sx={{ display: "inline-flex" }}>
                <BrandMark size={40} />
              </Box>
              <Typography sx={{ mt: 2 }}>
                Send a message to get started.
              </Typography>
            </Box>
          ) : (
            messages.map((m, i) => (
              <ChatItem
                key={i}
                role={m.role}
                content={m.content}
                isStreaming={
                  isSending && i === messages.length - 1 && m.role === "assistant"
                }
              />
            ))
          )}
        </Box>

        <Box sx={{ pt: 2 }}>
          <ChatInput onSend={handleSend} disabled={isSending} />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
