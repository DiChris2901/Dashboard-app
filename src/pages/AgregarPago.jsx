import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const AgregarPago = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [compromisoId, setCompromisoId] = useState("");
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [intereses, setIntereses] = useState("");
  const [total, setTotal] = useState("");

  const fetchCompromisos = async () => {
    const querySnapshot = await getDocs(collection(db, "compromisos"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCompromisos(lista);
  };

  const handleSelectChange = async (e) => {
    const id = e.target.value;
    setCompromisoId(id);

    const ref = doc(db, "compromisos", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setCompromisoSeleccionado(data);
      setIntereses("");
      setTotal(parseFloat(data.valor));
    }
  };

  const handleInteresesChange = (e) => {
    const valor = e.target.value;
    setIntereses(valor);
    const interesesNum = parseFloat(valor) || 0;
    const valorOriginal = parseFloat(compromisoSeleccionado?.valor || 0);
    setTotal(valorOriginal + interesesNum);
  };

  const handleGuardar = async () => {
    if (!compromisoId || !compromisoSeleccionado) return alert("Selecciona un compromiso válido.");

    try {
      await addDoc(collection(db, "pagos"), {
        compromisoId,
        valorOriginal: compromisoSeleccionado.valor,
        intereses: parseFloat(intereses) || 0,
        valorFinal: total,
        fechaRegistro: new Date(),
      });
      alert("Pago registrado correctamente.");
      setCompromisoId("");
      setCompromisoSeleccionado(null);
      setIntereses("");
      setTotal("");
    } catch (error) {
      console.error("Error al guardar el pago:", error);
      alert("Error al guardar el pago.");
    }
  };

  useEffect(() => {
    fetchCompromisos();
  }, []);

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Agregar Pago
          </Typography>

          <TextField
            select
            label="Seleccionar compromiso"
            fullWidth
            value={compromisoId}
            onChange={handleSelectChange}
            margin="normal"
          >
            <MenuItem value="">-- Selecciona --</MenuItem>
            {compromisos.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {`${c.empresa} - ${c.concepto} (${c.mes})`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Valor a cancelar"
            fullWidth
            margin="normal"
            value={compromisoSeleccionado?.valor || ""}
            disabled
          />

          <TextField
            label="Intereses (opcional)"
            fullWidth
            margin="normal"
            type="number"
            value={intereses}
            onChange={handleInteresesChange}
          />

          <TextField
            label="Valor total cancelado"
            fullWidth
            margin="normal"
            type="number"
            value={total}
            disabled
          />

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar Pago
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgregarPago;
