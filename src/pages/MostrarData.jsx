import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import EditarCompromiso from "../components/EditarCompromiso";

const MostrarData = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [empresaList, setEmpresaList] = useState([]);
  const [inputEmpresa, setInputEmpresa] = useState("");
  const [filtro, setFiltro] = useState({
    empresa: "",
    mes: "",
    concepto: "",
  });

  const [openEditar, setOpenEditar] = useState(false);
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);

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

  const handleChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCompromisos = async () => {
    const querySnapshot = await getDocs(collection(db, "compromisos"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const empresasUnicas = [...new Set(data.map((d) => d.empresa).filter(Boolean))];
    setEmpresaList(empresasUnicas);
    setCompromisos(data);
  };

  useEffect(() => {
    fetchCompromisos();
  }, []);

  const compromisosFiltrados = compromisos.filter((c) => {
    return (
      (filtro.empresa === "" || c.empresa?.toLowerCase().includes(filtro.empresa.toLowerCase())) &&
      (filtro.concepto === "" || c.concepto?.toLowerCase().includes(filtro.concepto.toLowerCase())) &&
      (filtro.mes === "" || (c.mes && c.mes.split("-")[1] === filtro.mes))
    );
  });

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este compromiso?")) {
      await deleteDoc(doc(db, "compromisos", id));
      fetchCompromisos();
    }
  };

  const handleEditar = (compromiso) => {
    setCompromisoSeleccionado(compromiso);
    setOpenEditar(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Mostrar Compromisos
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                freeSolo
                options={empresaList}
                inputValue={inputEmpresa}
                onInputChange={(event, newInputValue) => {
                  setInputEmpresa(newInputValue);
                  setFiltro({ ...filtro, empresa: newInputValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Empresa" fullWidth sx={{ minWidth: 200 }} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Mes"
                name="mes"
                value={filtro.mes}
                onChange={handleChange}
                fullWidth
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {meses.map((mes) => (
                  <MenuItem key={mes.valor} value={mes.valor}>
                    {mes.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Concepto"
                name="concepto"
                value={filtro.concepto}
                onChange={handleChange}
                fullWidth
                sx={{ minWidth: 200 }}
              />
            </Grid>
          </Grid>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Mes</TableCell>
                <TableCell>Beneficiario</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Aplazado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compromisosFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.empresa}</TableCell>
                  <TableCell>{c.mes}</TableCell>
                  <TableCell>{c.beneficiario}</TableCell>
                  <TableCell>{c.concepto}</TableCell>
                  <TableCell>${c.valor?.toLocaleString()}</TableCell>
                  <TableCell>{c.metodoPago}</TableCell>
                  <TableCell>{c.aplazado ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditar(c)}><Edit /></IconButton>
                    <IconButton onClick={() => handleEliminar(c.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditarCompromiso
        open={openEditar}
        onClose={() => setOpenEditar(false)}
        compromiso={compromisoSeleccionado}
        onSave={fetchCompromisos}
      />
    </Box>
  );
};

export default MostrarData;
