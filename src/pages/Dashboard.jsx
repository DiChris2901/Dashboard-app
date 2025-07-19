import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const Dashboard = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "compromisos"), (snap) => {
      const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompromisos(datos);
    });

    const unsub2 = onSnapshot(collection(db, "pagos"), (snap) => {
      const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPagos(datos);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const totalCompromisos = compromisos.length;
  const totalPagos = pagos.length;
  const pagosRealizadosIds = pagos.map((p) => p.compromisoId);
  const pagosPendientes = compromisos.filter(
    (c) => !pagosRealizadosIds.includes(c.id)
  );

  const valorTotalComprometido = compromisos.reduce((sum, c) => sum + (c.valor || 0), 0);
  const valorTotalPagado = pagos.reduce((sum, p) => sum + (p.valorCancelado || 0), 0);
  const valorPendiente = valorTotalComprometido - valorTotalPagado;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Bienvenido 👋
      </Typography>
      <Typography variant="body1" gutterBottom>
        Hoy es <b>19 de July de 2025</b> — aquí tienes un resumen general:
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6">Compromisos registrados</Typography>
              <Typography variant="h4">{totalCompromisos}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#c8e6c9" }}>
            <CardContent>
              <Typography variant="h6">Pagos realizados</Typography>
              <Typography variant="h4">{totalPagos}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#fff9c4" }}>
            <CardContent>
              <Typography variant="h6">Pagos pendientes</Typography>
              <Typography variant="h4">{pagosPendientes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#ede7f6" }}>
            <CardContent>
              <Typography variant="h6">Valor comprometido</Typography>
              <Typography variant="h5">
                ${valorTotalComprometido.toLocaleString("es-CO")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#dcedc8" }}>
            <CardContent>
              <Typography variant="h6">Valor pagado</Typography>
              <Typography variant="h5">
                ${valorTotalPagado.toLocaleString("es-CO")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#ffcdd2" }}>
            <CardContent>
              <Typography variant="h6">Valor pendiente</Typography>
              <Typography variant="h5">
                ${valorPendiente.toLocaleString("es-CO")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
