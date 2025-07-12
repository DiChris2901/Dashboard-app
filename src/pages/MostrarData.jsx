import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const MostrarData = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [recurrentes, setRecurrentes] = useState([]);
  const [abrirDialogo, setAbrirDialogo] = useState(false);
  const [añoDestino, setAñoDestino] = useState("");
  const [añoFiltrado, setAñoFiltrado] = useState(new Date().getFullYear());

  useEffect(() => {
    const cargarDatos = async () => {
      const snap = await getDocs(collection(db, "compromisos"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDatos(data);
      setRecurrentes(data.filter((item) => item.periodicidad !== "Pago único"));
      setCargando(false);
    };
    cargarDatos();
  }, []);

  const datosFiltrados = datos.filter((item) => {
    const año = item.año || item.createdAt?.toDate()?.getFullYear();
    return año === parseInt(añoFiltrado);
  });

  const replicarPagos = async () => {
    for (const item of recurrentes) {
      const docBase = { ...item };
      delete docBase.id;
      docBase.createdAt = new Date();
      docBase.año = parseInt(añoDestino);
      await addDoc(collection(db, "compromisos"), docBase);
    }
    alert("Pagos replicados correctamente");
    setAbrirDialogo(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mostrar Data
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => setAbrirDialogo(true)}>
          Replicar pagos recurrentes
        </Button>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Año</InputLabel>
          <Select
            label="Año"
            value={añoFiltrado}
            onChange={(e) => setAñoFiltrado(e.target.value)}
          >
            {[2023, 2024, 2025, 2026].map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {cargando ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Mes</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Aplazado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosFiltrados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.empresa}</TableCell>
                  <TableCell>{item.mes}</TableCell>
                  <TableCell>{item.concepto}</TableCell>
                  <TableCell>${item.valor?.toLocaleString()}</TableCell>
                  <TableCell>{item.metodo_pago}</TableCell>
                  <TableCell>{item.aplazado ? "Sí" : "No"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => alert("Editar " + item.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => alert("Eliminar " + item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={abrirDialogo} onClose={() => setAbrirDialogo(false)}>
        <DialogTitle>Replicar pagos</DialogTitle>
        <DialogContent>
          <TextField
            label="Año destino"
            fullWidth
            type="number"
            value={añoDestino}
            onChange={(e) => setAñoDestino(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbrirDialogo(false)}>Cancelar</Button>
          <Button onClick={replicarPagos}>Replicar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MostrarData;
