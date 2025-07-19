import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const Dashboard = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [filtros, setFiltros] = useState({ empresa: "", mes: "", concepto: "" });

  const [empresas, setEmpresas] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const mesActual = new Date().toLocaleString("es-CO", { month: "long" });

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "compromisos"), (snap) => {
      const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompromisos(datos);
      const empresasUnicas = [...new Set(datos.map((d) => d.empresa).filter(Boolean))];
      const conceptosUnicos = [...new Set(datos.map((d) => d.concepto).filter(Boolean))];
      setEmpresas(empresasUnicas);
      setConceptos(conceptosUnicos);
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

  const compromisosFiltrados = compromisos.filter((c) => {
    const matchEmpresa = filtros.empresa ? c.empresa === filtros.empresa : true;
    const matchMes = filtros.mes ? c.mes === filtros.mes : true;
    const matchConcepto = filtros.concepto ? c.concepto === filtros.concepto : true;
    return matchEmpresa && matchMes && matchConcepto;
  });

  const pagosFiltrados = pagos.filter((p) => {
    const comp = compromisos.find((c) => c.id === p.compromisoId);
    if (!comp) return false;

    const matchEmpresa = filtros.empresa ? comp.empresa === filtros.empresa : true;
    const matchMes = filtros.mes ? comp.mes === filtros.mes : true;
    const matchConcepto = filtros.concepto ? comp.concepto === filtros.concepto : true;
    return matchEmpresa && matchMes && matchConcepto;
  });

  const pagosRealizadosIds = pagosFiltrados.map((p) => p.compromisoId);
  const pagosPendientes = compromisosFiltrados.filter(
    (c) => !pagosRealizadosIds.includes(c.id)
  );

  const valorTotalComprometido = compromisosFiltrados.reduce((sum, c) => sum + (c.valor || 0), 0);
  const valorTotalPagado = pagosFiltrados.reduce((sum, p) => sum + (p.valorCancelado || 0), 0);
  const valorPendiente = valorTotalComprometido - valorTotalPagado;

  const pendientesEsteMes = pagosPendientes.filter(
    (c) => c.mes?.toLowerCase() === mesActual.toLowerCase()
  );

  const handleFiltroChange = (campo) => (e) => {
    setFiltros({ ...filtros, [campo]: e.target.value });
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Bienvenido 👋
      </Typography>
      <Typography variant="body1" gutterBottom>
        Hoy es <b>{new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</b>
      </Typography>

      {pendientesEsteMes.length > 0 ? (
        <Alert severity="warning" sx={{ my: 2 }}>
          ⚠️ Tienes {pendientesEsteMes.length} compromiso(s) pendiente(s) para este mes ({mesActual}).
        </Alert>
      ) : (
        <Alert severity="success" sx={{ my: 2 }}>
          ✅ No tienes compromisos pendientes para el mes actual ({mesActual}).
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          select
          label="Empresa"
          value={filtros.empresa}
          onChange={handleFiltroChange("empresa")}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {empresas.map((e) => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Mes"
          value={filtros.mes}
          onChange={handleFiltroChange("mes")}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {meses.map((mes) => (
            <MenuItem key={mes} value={mes}>{mes}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Concepto"
          value={filtros.concepto}
          onChange={handleFiltroChange("concepto")}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {conceptos.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="subtitle2">Compromisos registrados</Typography>
              <Typography variant="h5">{compromisosFiltrados.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#c8e6c9" }}>
            <CardContent>
              <Typography variant="subtitle2">Pagos realizados</Typography>
              <Typography variant="h5">{pagosFiltrados.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#fff9c4" }}>
            <CardContent>
              <Typography variant="subtitle2">Pagos pendientes</Typography>
              <Typography variant="h5">{pagosPendientes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#ede7f6" }}>
            <CardContent>
              <Typography variant="subtitle2">Valor comprometido</Typography>
              <Typography variant="h5">${valorTotalComprometido.toLocaleString("es-CO")}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#dcedc8" }}>
            <CardContent>
              <Typography variant="subtitle2">Valor pagado</Typography>
              <Typography variant="h5">${valorTotalPagado.toLocaleString("es-CO")}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ bgcolor: "#ffcdd2" }}>
            <CardContent>
              <Typography variant="subtitle2">Valor pendiente</Typography>
              <Typography variant="h5">${valorPendiente.toLocaleString("es-CO")}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
