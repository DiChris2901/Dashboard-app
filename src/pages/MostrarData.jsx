import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalComprobante from "../components/ModalComprobante";

const MostrarData = () => {
  const [filtrados, setFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({ empresa: "", mes: "", concepto: "" });
  const [comprobanteUrl, setComprobanteUrl] = useState(null);

  useEffect(() => {
    let unsubscribeCompromisos;
    let unsubscribePagos;

    const fetchData = async () => {
      const compromisosRef = collection(db, "compromisos");
      const pagosRef = collection(db, "pagos");

      const compromisosMap = new Map();
      const pagosMap = new Map();

      unsubscribeCompromisos = onSnapshot(compromisosRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          compromisosMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        if (pagosMap.size > 0) mergeData();
      });

      unsubscribePagos = onSnapshot(pagosRef, (snapshot) => {
        pagosMap.clear();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          pagosMap.set(data.compromisoId, { id: doc.id, ...data });
        });

        if (compromisosMap.size > 0) mergeData();
      });

      const mergeData = () => {
        const merged = [];

        compromisosMap.forEach((comp, id) => {
          const pago = pagosMap.get(id);
          if (pago) {
            merged.push({
              ...comp,
              ...pago,
              tienePago: true,
            });
          } else {
            merged.push({
              ...comp,
              tienePago: false,
            });
          }
        });

        setFiltrados(merged);
      };
    };

    fetchData();

    return () => {
      if (unsubscribeCompromisos) unsubscribeCompromisos();
      if (unsubscribePagos) unsubscribePagos();
    };
  }, []);

  const handleFiltroChange = (campo) => (e) => {
    setFiltros((prev) => ({ ...prev, [campo]: e.target.value.toLowerCase() }));
  };

  const handleEdit = (item) => {
    console.log("Editar:", item);
    // Aquí puedes abrir un modal o navegar a otra ruta
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await deleteDoc(doc(db, "compromisos", id));
    }
  };

  const datosFiltrados = filtrados.filter((item) => {
    return (
      item.empresa?.toLowerCase().includes(filtros.empresa) &&
      item.mes?.toLowerCase().includes(filtros.mes) &&
      item.concepto?.toLowerCase().includes(filtros.concepto)
    );
  });

  return (
    <Card className="p-4">
      <Typography variant="h5" gutterBottom>
        Mostrar Data
      </Typography>
      <div className="flex flex-wrap gap-2 mb-4">
        <TextField
          label="Empresa"
          value={filtros.empresa}
          onChange={handleFiltroChange("empresa")}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Mes"
          value={filtros.mes}
          onChange={handleFiltroChange("mes")}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Concepto"
          value={filtros.concepto}
          onChange={handleFiltroChange("concepto")}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Empresa</b></TableCell>
            <TableCell><b>Mes</b></TableCell>
            <TableCell><b>Concepto</b></TableCell>
            <TableCell><b>Valor</b></TableCell>
            <TableCell><b>Valor a cancelar</b></TableCell>
            <TableCell><b>Intereses</b></TableCell>
            <TableCell><b>Valor cancelado</b></TableCell>
            <TableCell><b>Comprobante</b></TableCell>
            <TableCell><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datosFiltrados.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.empresa}</TableCell>
              <TableCell>{item.mes}</TableCell>
              <TableCell>{item.concepto}</TableCell>
              <TableCell>${item.valor?.toLocaleString() || "-"}</TableCell>
              <TableCell>{item.valorOriginal ? `$${item.valorOriginal.toLocaleString()}` : "-"}</TableCell>
              <TableCell>{item.intereses ? `$${item.intereses.toLocaleString()}` : "-"}</TableCell>
              <TableCell>{item.valorFinal ? `$${item.valorFinal.toLocaleString()}` : "-"}</TableCell>
              <TableCell>
                {item.comprobanteUrl ? (
                  <Tooltip title="Ver comprobante">
                    <IconButton onClick={() => setComprobanteUrl(item.comprobanteUrl)}>
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ModalComprobante url={comprobanteUrl} onClose={() => setComprobanteUrl(null)} />
    </Card>
  );
};

export default MostrarData;
