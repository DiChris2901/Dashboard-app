import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
  FormControlLabel,
  Switch,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
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

  const [empresaList, setEmpresaList] = useState([]);

  const periodicidades = {
    "Pago Único": 0,
    Mensual: 1,
    Bimestral: 2,
    Trimestral: 3,
    Cuatrimestral: 4,
    Semestral: 6,
    Anual: 12,
  };

  const meses = [
    { nombre: "Enero", valor: "01" },
    { nombre: "Febrero", valor: "02" },
    { nombre: "Marzo", valor: "03" },
    { nombre: "Abril", valor: "04" },
    { nombre: "Mayo", valor: "05" },
    { nombre: "Junio", valor: "06" },
    { nombre: "Julio", valor: "07" },
    { nombre: "Agosto", valor: "08" },
    { nombre: "Septiembre", valor: "09" },
    { nombre: "Octubre", valor: "10" },
    { nombre: "Noviembre", valor: "11" },
    { nombre: "Diciembre", valor: "12" },
  ];

  const currentYear = dayjs().year();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEmpresaChange = (event, value) => {
    setFormData({ ...formData, empresa: value });
  };

  const handleGuardar = async () => {
    const mesNumerico = meses.find((m) => m.nombre === formData.mes)?.valor;
    const repeticiones =
      periodicidades[formData.periodicidad] === 0
        ? 1
        : 12 / periodicidades[formData.periodicidad];

    const baseMonth = dayjs(`${currentYear}-${mesNumerico}-01`);

    try {
      for (let i = 0; i < repeticiones; i++) {
        const mesCalculado = baseMonth.add(
          i * periodicidades[formData.periodicidad],
          "month"
        );

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
      alert(`Hubo un error al guardar el compromiso.\n${error.message}`);
    }
  };

  const cargarEmpresas = async () => {
    const querySnapshot = await getDocs(collection(db, "compromisos"));
    const empresas = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.empresa) empresas.add(data.empresa);
    });
    setEmpresaList([...empresas]);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 800 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Agregar Compromiso
          </Typography>

          <Autocomplete
            freeSolo
            options={empresaList}
            value={formData.empresa}
            onInputChange={handleEmpresaChange}
            renderInput={(params) => (
              <TextField {...params} label="Empresa" margin="normal" fullWidth />
            )}
          />

          <TextField
            select
            fullWidth
            label="Mes"
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            margin="normal"
          >
            {meses.map((mes) => (
              <MenuItem key={mes.valor} value={mes.nombre}>
                {mes.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Periodicidad"
            name="periodicidad"
            value={formData.periodicidad}
            onChange={handleChange}
            margin="normal"
          >
            {Object.keys(periodicidades).map((period) => (
              <MenuItem key={period} value={period}>
                {period}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Beneficiario"
            name="beneficiario"
            value={formData.beneficiario}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Concepto"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Valor"
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Método de Pago"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="Transferencia">Transferencia</MenuItem>
            <MenuItem value="PSE">PSE</MenuItem>
            <MenuItem value="Efectivo">Efectivo</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                name="aplazado"
                checked={formData.aplazado}
                onChange={handleChange}
              />
            }
            label="Aplazado"
            sx={{ mt: 2 }}
          />

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar Compromiso
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgregarCompromiso;
