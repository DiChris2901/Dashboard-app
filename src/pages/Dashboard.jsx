import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Divider
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");

  useEffect(() => {
    const unsubscribe1 = onSnapshot(collection(db, "compromisos"), (snapshot) => {
      setCompromisos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribe2 = onSnapshot(collection(db, "pagos"), (snapshot) => {
      setPagos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const empresas = [...new Set(compromisos.map(c => c.empresa))];
  const conceptos = [...new Set(compromisos.map(c => c.concepto))];

  const pagosPendientes = compromisos.filter(c => !pagos.some(p => p.compromisoId === c.id));
  const siguienteCompromiso = pagosPendientes[0] || null;

  const pagosPorMes = pagos.reduce((acc, pago) => {
    const comp = compromisos.find(c => c.id === pago.compromisoId);
    if (comp?.mes) {
      acc[comp.mes] = (acc[comp.mes] || 0) + (pago.valorCancelado || 0);
    }
    return acc;
  }, {});

  const mesesPagos = Object.entries(pagosPorMes).sort(
    (a, b) => meses.indexOf(b[0]) - meses.indexOf(a[0])
  );

  const ultimoPago = pagos.sort(
    (a, b) => b.fecha?.toMillis?.() - a.fecha?.toMillis?.()
  )[0];
  const compromisoUltimoPago = ultimoPago
    ? compromisos.find(c => c.id === ultimoPago.compromisoId)
    : null;

  const dataFiltrada = compromisos.filter((c) =>
    (!empresaFiltro || c.empresa === empresaFiltro) &&
    (!mesFiltro || c.mes === mesFiltro) &&
    (!conceptoFiltro || c.concepto === conceptoFiltro)
  );

  const pagosFiltradosTotales = pagos.filter((p) => {
    const compromisoRelacionado = compromisos.find(c => c.id === p.compromisoId);
    return (
      compromisoRelacionado &&
      (!empresaFiltro || compromisoRelacionado.empresa === empresaFiltro) &&
      (!mesFiltro || compromisoRelacionado.mes === mesFiltro) &&
      (!conceptoFiltro || compromisoRelacionado.concepto === conceptoFiltro)
    );
  });

  const totalCompromisos = dataFiltrada.length;
  const totalPagos = pagosFiltradosTotales.length;
  const totalPendientes = dataFiltrada.filter(c => !pagosFiltradosTotales.some(p => p.compromisoId === c.id)).length;
  const valorComprometido = dataFiltrada.reduce((sum, c) => sum + (c.valor || 0), 0);
  const valorPagado = pagosFiltradosTotales.reduce((sum, p) => sum + (p.valorCancelado || 0), 0);
  const valorPendiente = valorComprometido - valorPagado;

  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      <Typography variant="h6" mb={1}>
        Bienvenido 👋
      </Typography>
      <Typography variant="body2" gutterBottom>
        Hoy es <strong>{fechaHoy}</strong>
      </Typography>
      <Alert severity="success" sx={{ mb: 2 }}>
        ✅ No tienes compromisos pendientes para el mes actual (julio).
      </Alert>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="subtitle2">📌 Próximo compromiso</Typography>
            {siguienteCompromiso ? (
              <>
                <Typography variant="body2">Empresa: {siguienteCompromiso.empresa}</Typography>
                <Typography variant="body2">Mes: {siguienteCompromiso.mes}</Typography>
                <Typography variant="body2">Valor: ${siguienteCompromiso.valor?.toLocaleString("es-CO")}</Typography>
              </>
            ) : <Typography variant="body2">✅ No hay compromisos pendientes</Typography>}
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="subtitle2">📈 Tendencia de pagos</Typography>
            {mesesPagos.length >= 2 ? (
              <>
                <Typography variant="body2">{mesesPagos[0][0]}: ${mesesPagos[0][1].toLocaleString("es-CO")}</Typography>
                <Typography variant="body2">{mesesPagos[1][0]}: ${mesesPagos[1][1].toLocaleString("es-CO")}</Typography>
                <Typography variant="body2">⬆️ {(100 * ((mesesPagos[0][1] - mesesPagos[1][1]) / mesesPagos[1][1])).toFixed(1)}%</Typography>
              </>
            ) : <Typography variant="body2">Aún no hay datos suficientes</Typography>}
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="subtitle2">💸 Último pago</Typography>
            {ultimoPago ? (
              <>
                <Typography variant="body2">Empresa: {compromisoUltimoPago?.empresa || "-"}</Typography>
                <Typography variant="body2">Valor: ${ultimoPago.valorCancelado?.toLocaleString("es-CO")}</Typography>
                <Typography variant="body2">Fecha: {ultimoPago.fecha?.toDate?.().toLocaleDateString("es-CO")}</Typography>
              </>
            ) : <Typography variant="body2">No hay pagos registrados</Typography>}
          </CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4} md={3}>
          <TextField select fullWidth label="Empresa" value={empresaFiltro} onChange={(e) => setEmpresaFiltro(e.target.value)}>
            <MenuItem value="">Todas</MenuItem>
            {empresas.map((empresa) => (
              <MenuItem key={empresa} value={empresa}>{empresa}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField select fullWidth label="Mes" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {meses.map((mes) => (
              <MenuItem key={mes} value={mes}>{mes}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField select fullWidth label="Concepto" value={conceptoFiltro} onChange={(e) => setConceptoFiltro(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {conceptos.map((concepto) => (
              <MenuItem key={concepto} value={concepto}>{concepto}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#e3f2fd" }}><CardContent>
            <Typography variant="body2">Compromisos registrados</Typography>
            <Typography variant="h6">{totalCompromisos}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#d0f0c0" }}><CardContent>
            <Typography variant="body2">Pagos realizados</Typography>
            <Typography variant="h6">{totalPagos}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#fff9c4" }}><CardContent>
            <Typography variant="body2">Pagos pendientes</Typography>
            <Typography variant="h6">{totalPendientes}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#ede7f6" }}><CardContent>
            <Typography variant="body2">Valor comprometido</Typography>
            <Typography variant="h6">${valorComprometido.toLocaleString("es-CO")}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#dcedc8" }}><CardContent>
            <Typography variant="body2">Valor pagado</Typography>
            <Typography variant="h6">${valorPagado.toLocaleString("es-CO")}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ backgroundColor: "#ffcdd2" }}><CardContent>
            <Typography variant="body2">Valor pendiente</Typography>
            <Typography variant="h6">${valorPendiente.toLocaleString("es-CO")}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" gutterBottom>
        Registros filtrados
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Mes</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Valor Cancelado</TableCell>
              <TableCell>Intereses</TableCell>
              <TableCell>Valor Total Cancelado</TableCell>
              <TableCell>Comprobante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataFiltrada.map((c) => {
              const pago = pagos.find((p) => p.compromisoId === c.id);
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.empresa}</TableCell>
                  <TableCell>{c.mes}</TableCell>
                  <TableCell>{c.concepto}</TableCell>
                  <TableCell>${c.valor?.toLocaleString("es-CO")}</TableCell>
                  <TableCell>${pago?.valorCancelado?.toLocaleString("es-CO") || "-"}</TableCell>
                  <TableCell>${pago?.intereses?.toLocaleString("es-CO") || "-"}</TableCell>
                  <TableCell>
                    {pago ? `$${((pago.valorCancelado || 0) + (pago.intereses || 0)).toLocaleString("es-CO")}` : "-"}
                  </TableCell>
                  <TableCell>
                    {pago?.comprobanteUrl ? (
                      <a href={pago.comprobanteUrl} target="_blank" rel="noreferrer">Ver</a>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Dashboard;
