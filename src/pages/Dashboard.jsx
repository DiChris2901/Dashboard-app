import { Box, Typography, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resumen Financiero
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí verás las gráficas y el resumen de compromisos y pagos.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
