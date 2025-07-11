// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const compromisosRef = collection(db, "compromisos");
      const snapshot = await getDocs(compromisosRef);
      const data = snapshot.docs.map(doc => doc.data());

      // Procesar los datos
      const totalValor = data.reduce((acc, item) => acc + (item.valor || 0), 0);
      const empresas = [...new Set(data.map(item => item.empresa))];
      const aplazados = data.filter(item => item.aplazado === true).length;

      const mesActual = new Date().toLocaleString("default", { month: "long" });
      const delMes = data.filter(
        item => (item.mes || "").toLowerCase() === mesActual.toLowerCase()
      ).length;

      setResumen({
        totalValor,
        empresas: empresas.length,
        aplazados,
        delMes,
      });
    };

    fetchData();
  }, []);

  if (!resumen) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Cargando datos...</Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard financiero
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total compromisos</Typography>
            <Typography variant="h5" color="primary">
              ${resumen.totalValor.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Empresas únicas</Typography>
            <Typography variant="h5">{resumen.empresas}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Aplazados</Typography>
            <Typography variant="h5">{resumen.aplazados}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Este mes</Typography>
            <Typography variant="h5">{resumen.delMes}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
