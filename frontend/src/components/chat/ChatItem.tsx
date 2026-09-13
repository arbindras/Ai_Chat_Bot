import { Avatar, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import BrandMark from "../shared/BrandMark";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../helpers/initials";

type Props = {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
};

const ChatItem = ({ content, role, isStreaming }: Props) => {
  const auth = useAuth();
  const isAssistant = role === "assistant";

  return (
    <Box sx={{ display: "flex", gap: 1.5, py: 1.75 }}>
      {isAssistant ? (
        <Box sx={{ width: 30, height: 30, flexShrink: 0, mt: 0.3 }}>
          <BrandMark size={30} />
        </Box>
      ) : (
        <Avatar
          sx={{
            width: 30,
            height: 30,
            mt: 0.3,
            fontSize: 12,
            fontWeight: 700,
            bgcolor: "primary.main",
          }}
        >
          {getInitials(auth?.user?.name)}
        </Avatar>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.3 }}>
          {isAssistant ? "Assistant" : auth?.user?.name || "You"}
        </Typography>

        <Box className="markdown-body" sx={{ fontSize: 15, lineHeight: 1.7 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const text = String(children).replace(/\n$/, "");
                if (!match) {
                  return (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                }
                return <CodeBlock language={match[1]} code={text} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && <span className="stream-cursor" aria-hidden="true" />}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;
