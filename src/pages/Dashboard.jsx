// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [meses, setMeses] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroConcepto, setFiltroConcepto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const compromisosRef = collection(db, "compromisos");
      const snapshot = await getDocs(compromisosRef);
      const data = snapshot.docs.map((doc) => doc.data());

      const totalValor = data.reduce((acc, item) => acc + (item.valor || 0), 0);
      const empresas = [...new Set(data.map((item) => item.empresa).filter(Boolean))];
      const aplazados = data.filter((item) => item.aplazado === true).length;

      const mesActual = new Date().toLocaleString("default", { month: "long" });
      const delMes = data.filter(
        (item) => (item.mes || "").toLowerCase() === mesActual.toLowerCase()
      ).length;

      const meses = [...new Set(data.map((item) => item.mes).filter(Boolean))];
      const conceptos = [...new Set(data.map((item) => item.concepto).filter(Boolean))];

      setResumen({
        totalValor,
        empresas: empresas.length,
        aplazados,
        delMes,
      });

      setEmpresas(empresas);
      setMeses(meses);
      setConceptos(conceptos);
      setOriginalData(data);
      setFilteredData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      let data = [...originalData];

      if (filtroEmpresa) {
        data = data.filter((item) =>
          item.empresa?.toLowerCase().includes(filtroEmpresa.toLowerCase())
        );
      }

      if (filtroMes) {
        data = data.filter((item) => item.mes === filtroMes);
      }

      if (filtroConcepto) {
        data = data.filter((item) => item.concepto === filtroConcepto);
      }

      setFilteredData(data);
    };

    aplicarFiltros();
  }, [filtroEmpresa, filtroMes, filtroConcepto, originalData]);

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

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Autocomplete
          freeSolo
          options={empresas}
          value={filtroEmpresa}
          onChange={(e, newValue) => setFiltroEmpresa(newValue || "")}
          onInputChange={(e, newValue) => setFiltroEmpresa(newValue || "")}
          renderInput={(params) => <TextField {...params} label="Empresa" />}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Mes</InputLabel>
          <Select
            value={filtroMes}
            label="Mes"
            onChange={(e) => setFiltroMes(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {meses.map((mes, index) => (
              <MenuItem key={index} value={mes}>
                {mes}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Concepto</InputLabel>
          <Select
            value={filtroConcepto}
            label="Concepto"
            onChange={(e) => setFiltroConcepto(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {conceptos.map((c, index) => (
              <MenuItem key={index} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
