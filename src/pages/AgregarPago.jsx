import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase";

const AgregarPago = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [compromisoId, setCompromisoId] = useState("");
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [pagoExistente, setPagoExistente] = useState(null);
  const [pagoDocId, setPagoDocId] = useState(null);

  const [valorOriginal, setValorOriginal] = useState(0);
  const [intereses, setIntereses] = useState("");
  const [total, setTotal] = useState("");

  const [archivo, setArchivo] = useState(null);
  const [comprobanteUrl, setComprobanteUrl] = useState("");

  const fetchCompromisos = async () => {
    const querySnapshot = await getDocs(collection(db, "compromisos"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCompromisos(lista);
  };

  const fetchPagoExistente = async (id) => {
    const q = query(collection(db, "pagos"), where("compromisoId", "==", id));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const pago = snap.docs[0].data();
      setPagoExistente(pago);
      setPagoDocId(snap.docs[0].id);
      setIntereses(pago.intereses);
      setValorOriginal(pago.valorOriginal);
      if (pago.comprobanteUrl) setComprobanteUrl(pago.comprobanteUrl);
    } else {
      setPagoExistente(null);
      setPagoDocId(null);
      setIntereses("");
      setTotal("");
      setComprobanteUrl("");
    }
  };

  const handleSelectChange = async (e) => {
    const id = e.target.value;
    setCompromisoId(id);

    const ref = doc(db, "compromisos", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setCompromisoSeleccionado(data);
      if (!pagoExistente) setValorOriginal(parseFloat(data.valor) || 0);
      await fetchPagoExistente(id);
    }
  };

  const handleInteresesChange = (e) => {
    const valor = e.target.value;
    setIntereses(valor);
  };

  useEffect(() => {
    const interesesNum = parseFloat(intereses) || 0;
    setTotal(valorOriginal + interesesNum);
  }, [intereses, valorOriginal]);

  const handleArchivoChange = (e) => {
    if (e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubirComprobante = async () => {
    if (!archivo || !compromisoId) {
      alert("Selecciona un archivo y un compromiso antes de subir.");
      return;
    }

    try {
      const storage = getStorage();
      const nombre = `comprobantes/${compromisoId}-${Date.now()}-${archivo.name}`;
      const archivoRef = ref(storage, nombre);
      await uploadBytes(archivoRef, archivo);
      const url = await getDownloadURL(archivoRef);
      setComprobanteUrl(url);
      alert("Comprobante subido correctamente.");
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert("Error al subir el comprobante.");
    }
  };

  const handleGuardar = async () => {
    if (!compromisoId || !compromisoSeleccionado) return alert("Selecciona un compromiso válido.");

    try {
      const data = {
        compromisoId,
        valorOriginal,
        intereses: parseFloat(intereses) || 0,
        valorFinal: total,
        fechaRegistro: new Date(),
        comprobanteUrl, // no se guarda si está vacío
      };

      if (pagoDocId) {
        await updateDoc(doc(db, "pagos", pagoDocId), data);
        alert("Pago actualizado correctamente.");
      } else {
        await addDoc(collection(db, "pagos"), data);
        alert("Pago registrado correctamente.");
      }

      // reset
      setCompromisoId("");
      setCompromisoSeleccionado(null);
      setPagoExistente(null);
      setPagoDocId(null);
      setIntereses("");
      setTotal("");
      setValorOriginal(0);
      setArchivo(null);
      setComprobanteUrl("");
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

          {pagoExistente && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Este compromiso ya tiene un pago registrado. Puedes corregirlo si fue un error.
            </Alert>
          )}

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
            value={valorOriginal}
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

          <Box sx={{ mt: 2 }}>
            <input type="file" onChange={handleArchivoChange} accept=".pdf,.jpg,.png" />
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={handleSubirComprobante}
              disabled={!archivo || !compromisoId}
            >
              Subir Comprobante
            </Button>

            {comprobanteUrl && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Enlace generado: <a href={comprobanteUrl} target="_blank" rel="noreferrer">Ver comprobante</a>
              </Typography>
            )}
          </Box>

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button variant="contained" onClick={handleGuardar}>
              {pagoDocId ? "Actualizar Pago" : "Guardar Pago"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgregarPago;
