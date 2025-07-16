import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

const AgregarCompromiso = () => {
  const [formData, setFormData] = useState({
    empresa: "",
    mes: "",
    periodicidad: "Pago Único",
    beneficiario: "",
    concepto: "",
    valor: "",
    metodoPago: "",
    observaciones: "",
    aplazado: false,
  });

  const periodicidades = {
    "Pago Único": 0,
    Mensual: 1,
    Bimestral: 2,
    Trimestral: 3,
    Cuatrimestral: 4,
    Semestral: 6,
    Anual: 12,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGuardar = async () => {
    const repeticiones = periodicidades[formData.periodicidad] === 0 ? 1 : 12 / periodicidades[formData.periodicidad];
    const baseMonth = dayjs(`${formData.mes}-01`);

    try {
      for (let i = 0; i < repeticiones; i++) {
        const mesCalculado = baseMonth.add(i * periodicidades[formData.periodicidad], "month");
        await addDoc(collection(db, "compromisos"), {
          ...formData,
          mes: mesCalculado.format("YYYY-MM"),
          valor: parseFloat(formData.valor),
          fechaCreacion: Timestamp.now(),
        });
      }
      alert("Compromiso(s) guardado(s) correctamente.");
      setFormData({
        empresa: "",
        mes: "",
        periodicidad: "Pago Único",
        beneficiario: "",
        concepto: "",
        valor: "",
        metodoPago: "",
        observaciones: "",
        aplazado: false,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el compromiso.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Agregar Compromiso
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Empresa" name="empresa" value={formData.empresa} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="month" label="Mes Inicial" name="mes" value={formData.mes} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Periodicidad" name="periodicidad" value={formData.periodicidad} onChange={handleChange}>
                {Object.keys(periodicidades).map((period) => (
                  <MenuItem key={period} value={period}>{period}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Beneficiario" name="beneficiario" value={formData.beneficiario} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Concepto" name="concepto" value={formData.concepto} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Valor" name="valor" value={formData.valor} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Método de Pago" name="metodoPago" value={formData.metodoPago} onChange={handleChange}>
                <MenuItem value="Transferencia">Transferencia</MenuItem>
                <MenuItem value="PSE">PSE</MenuItem>
                <MenuItem value="Efectivo">Efectivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline label="Observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch name="aplazado" checked={formData.aplazado} onChange={handleChange} />} label="Aplazado" />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button variant="contained" onClick={handleGuardar}>Guardar Compromiso</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgregarCompromiso;
