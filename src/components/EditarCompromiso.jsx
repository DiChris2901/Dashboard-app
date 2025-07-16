import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const EditarCompromiso = ({ open, onClose, compromiso, onSave }) => {
  const [formData, setFormData] = useState({
    empresa: "",
    mes: "",
    beneficiario: "",
    concepto: "",
    valor: "",
    metodoPago: "",
    observaciones: "",
    aplazado: false,
  });

  useEffect(() => {
    if (compromiso) {
      setFormData({
        empresa: compromiso.empresa || "",
        mes: compromiso.mes || "",
        beneficiario: compromiso.beneficiario || "",
        concepto: compromiso.concepto || "",
        valor: compromiso.valor || "",
        metodoPago: compromiso.metodoPago || "",
        observaciones: compromiso.observaciones || "",
        aplazado: compromiso.aplazado || false,
      });
    }
  }, [compromiso]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updateDoc(doc(db, "compromisos", compromiso.id), {
        ...formData,
        valor: parseFloat(formData.valor),
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar.");
    }
  };

  if (!compromiso) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Compromiso</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Mes"
          name="mes"
          value={formData.mes}
          onChange={handleChange}
          margin="normal"
        />
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
          type="number"
          label="Valor"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarCompromiso;
