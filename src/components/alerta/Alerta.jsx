import { Alert, Snackbar } from "@mui/material";

const Alerta = ({
  label,
  icon,
  severity = "success",
  variant = "filled",
  open,
  setAlertaOpen,
}) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertaOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        icon={icon}
        severity={severity}
        variant={variant}
        onClose={() => setAlertaOpen(false)}
      >
        {label}
      </Alert>
    </Snackbar>
  );
};

export default Alerta;
