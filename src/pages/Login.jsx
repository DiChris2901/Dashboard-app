import { Box, Typography, Paper } from "@mui/material";

const Login = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Ingreso al sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esta será la pantalla de login (próximamente).
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
