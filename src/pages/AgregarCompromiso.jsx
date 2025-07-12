import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const AgregarCompromiso = () => {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresa: "",
    mes: "",
    periodicidad: "",
    beneficiario: "",
    concepto: "",
    valor: "",
    metodo_pago: "",
    observaciones: "",
    aplazado: false,
  });

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const periodicidades = [
    "Pago único", "Mensual", "Bimensual", "Trimestral",
    "Cuatrimestral", "Semestral", "Anual"
  ];

  const metodos = ["Transferencia", "PSE", "Efectivo"];

  useEffect(() => {
    const cargarEmpresas = async () => {
      const snap = await getDocs(collection(db, "compromisos"));
      const todas = snap.docs.map(doc => doc.data().empresa).filter(Boolean);
      setEmpresas([...new Set(todas)]);
    };
    cargarEmpresas();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docData = {
      ...form,
      valor: parseFloat(form.valor),
      createdAt: new Date(),
    };
    await addDoc(collection(db, "compromisos"), docData);
    alert("Compromiso guardado correctamente");
    setForm({
      empresa: "",
      mes: "",
      periodicidad: "",
      beneficiario: "",
      concepto: "",
      valor: "",
      metodo_pago: "",
      observaciones: "",
      aplazado: false,
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Agregar compromiso
        </Typography>

        <form onSubmit={handleSubmit}>
          <Autocomplete
            freeSolo
            options={empresas}
            value={form.empresa}
            onInputChange={(e, newValue) => setForm({ ...form, empresa: newValue })}
            renderInput={(params) => <TextField {...params} label="Empresa" required />}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Mes</InputLabel>
            <Select value={form.mes} onChange={handleChange("mes")} required>
              {meses.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Periodicidad</InputLabel>
            <Select
              value={form.periodicidad}
              onChange={handleChange("periodicidad")}
              required
            >
              {periodicidades.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Beneficiario"
            fullWidth
            value={form.beneficiario}
            onChange={handleChange("beneficiario")}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Concepto"
            fullWidth
            value={form.concepto}
            onChange={handleChange("concepto")}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Valor"
            fullWidth
            type="number"
            value={form.valor}
            onChange={handleChange("valor")}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Método de pago</InputLabel>
            <Select
              value={form.metodo_pago}
              onChange={handleChange("metodo_pago")}
              required
            >
              {metodos.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Observaciones"
            fullWidth
            value={form.observaciones}
            onChange={handleChange("observaciones")}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.aplazado}
                onChange={handleChange("aplazado")}
              />
            }
            label="Aplazado"
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary">
            Guardar compromiso
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AgregarCompromiso;
