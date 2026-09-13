import TextField from "@mui/material/TextField";

type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      fullWidth
      name={props.name}
      label={props.label}
      type={props.type}
      required
      sx={{
        maxWidth: 400,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2.5,
        },
      }}
    />
  );
};

export default CustomizedInput;
