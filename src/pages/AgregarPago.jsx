// src/pages/AgregarPago.jsx
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const AgregarPago = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [pago, setPago] = useState({
    valor: "",
    intereses: "",
    valor_final: "",
  });

  useEffect(() => {
    const cargarCompromisos = async () => {
      const snap = await getDocs(collection(db, "compromisos"));
      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompromisos(lista);
    };
    cargarCompromisos();
  }, []);

  const handleSeleccion = async (evento, item) => {
    setSeleccionado(item);
    if (!item) return;

    const refPago = doc(db, "pagos", item.id);
    const pagoSnap = await getDoc(refPago);

    if (pagoSnap.exists()) {
      const data = pagoSnap.data();
      setPago({
        valor: data.valor,
        intereses: data.intereses || "",
        valor_final: data.valor_final,
      });
    } else {
      setPago({
        valor: item.valor,
        intereses: "",
        valor_final: item.valor,
      });
    }
  };

  const handleChange = (campo) => (e) => {
    const valor = e.target.value;
    let nuevoPago = { ...pago, [campo]: valor };

    if (campo === "intereses" || campo === "valor") {
      const val = parseFloat(nuevoPago.valor) || 0;
      const int = parseFloat(nuevoPago.intereses) || 0;
      nuevoPago.valor_final = (val + int).toFixed(2);
    }

    setPago(nuevoPago);
  };

  const handleGuardar = async () => {
    if (!seleccionado) return alert("Debes seleccionar un compromiso.");

    const ref = doc(db, "pagos", seleccionado.id);
    await setDoc(ref, {
      compromisoId: seleccionado.id,
      valor: parseFloat(pago.valor),
      intereses: parseFloat(pago.intereses || 0),
      valor_final: parseFloat(pago.valor_final),
      createdAt: new Date(),
    });

    alert("Pago guardado correctamente.");
    setSeleccionado(null);
    setPago({ valor: "", intereses: "", valor_final: "" });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Agregar Pago
        </Typography>

        <Autocomplete
          options={compromisos}
          getOptionLabel={(option) =>
            `${option.empresa} - ${option.concepto} (${option.mes})`
          }
          value={seleccionado}
          onChange={handleSeleccion}
          renderInput={(params) => (
            <TextField {...params} label="Selecciona un compromiso" fullWidth />
          )}
          sx={{ mb: 3 }}
        />

        {seleccionado && (
          <>
            <TextField
              label="Valor a cancelar"
              fullWidth
              value={pago.valor}
              onChange={handleChange("valor")}
              type="number"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Intereses (opcional)"
              fullWidth
              value={pago.intereses}
              onChange={handleChange("intereses")}
              type="number"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Valor final pagado"
              fullWidth
              value={pago.valor_final}
              disabled
              type="number"
              sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={handleGuardar}>
              Guardar pago
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AgregarPago;
