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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const MostrarData = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const snap = await getDocs(collection(db, "compromisos"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDatos(data);
      setCargando(false);
    };
    cargarDatos();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mostrar Data
      </Typography>

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
              {datos.map((item) => (
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
    </Box>
  );
};

export default MostrarData;
