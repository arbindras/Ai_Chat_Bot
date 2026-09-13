import { useState, KeyboardEvent } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { FiSend } from "react-icons/fi";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled }: Props) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        p: 0.75,
        pl: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message the assistant… (Enter to send, Shift+Enter for a new line)"
        multiline
        maxRows={6}
        fullWidth
        variant="standard"
        disabled={disabled}
        slotProps={{ input: { disableUnderline: true } }}
        sx={{ py: 1 }}
      />
      <IconButton
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          flexShrink: 0,
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-disabled": {
            bgcolor: "action.disabledBackground",
            color: "action.disabled",
          },
        }}
      >
        <FiSend size={17} />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
