// src/pages/Dashboard.jsx
import { Box, Grid, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  const resumenes = [
    { label: "Total de pagos", value: "$124.500.000" },
    { label: "Empresas activas", value: "12" },
    { label: "Pagos este mes", value: "$17.800.000" },
    { label: "Conceptos registrados", value: "35" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard financiero
      </Typography>

      <Grid container spacing={2}>
        {resumenes.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {item.label}
              </Typography>
              <Typography variant="h5" color="primary">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
