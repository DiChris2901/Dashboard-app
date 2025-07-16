import { Box, Typography, Paper } from "@mui/material";

const Inicio = () => {
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{ p: 4, textAlign: "center", maxWidth: 800, width: "100%" }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido al Panel de Control Financiero DR Group
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Usa el menú lateral para navegar entre las funcionalidades del sistema.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Inicio;
