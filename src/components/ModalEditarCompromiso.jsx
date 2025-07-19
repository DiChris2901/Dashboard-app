import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const obtenerNombreMes = (valor) => {
  // Si ya es un nombre (Ej: "Febrero"), lo devolvemos igual
  if (meses.includes(valor)) return valor;

  // Si viene en formato "2025-02", extraemos el mes y convertimos
  const partes = valor.split("-");
  if (partes.length === 2) {
    const numeroMes = parseInt(partes[1], 10);
    return meses[numeroMes - 1] || "";
  }

  return "";
};

const ModalEditarCompromiso = ({ open, onClose, data }) => {
  const [form, setForm] = useState({
    empresa: "",
    mes: "",
    concepto: "",
    valor: "",
    observaciones: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        empresa: data.empresa || "",
        mes: obtenerNombreMes(data.mes || ""),
        concepto: data.concepto || "",
        valor: data.valor?.toString() || "",
        observaciones: data.observaciones || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!data?.compromisoId) return;
    try {
      const ref = doc(db, "compromisos", data.compromisoId);
      await updateDoc(ref, {
        ...form,
        valor: parseInt(form.valor),
      });
      onClose();
    } catch (err) {
      console.error("Error al guardar cambios:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Compromiso</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Empresa"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mes"
            name="mes"
            select
            value={form.mes}
            onChange={handleChange}
            fullWidth
          >
            {meses.map((mes) => (
              <MenuItem key={mes} value={mes}>
                {mes}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <span style={{ marginRight: 6 }}>$</span>,
              inputMode: "numeric",
            }}
          />
          <TextField
            label="Concepto"
            name="concepto"
            value={form.concepto}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar}>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditarCompromiso;
