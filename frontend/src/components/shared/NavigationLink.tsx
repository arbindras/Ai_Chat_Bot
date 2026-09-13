import { Link } from "react-router-dom";
import { Button } from "@mui/material";

type Props = {
  to: string;
  text: string;
  variant?: "primary" | "secondary";
  onClick?: () => void | Promise<void>;
};

const NavigationLink = ({ to, text, variant = "secondary", onClick }: Props) => {
  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      variant={variant === "primary" ? "contained" : "text"}
      color={variant === "primary" ? "primary" : "inherit"}
      disableElevation
      sx={{ ml: 1 }}
    >
      {text}
    </Button>
  );
};

export default NavigationLink;
