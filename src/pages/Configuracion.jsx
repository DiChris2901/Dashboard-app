// src/pages/Configuracion.jsx
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 2 }}>
      <Typography>{children}</Typography>
    </Box>
  ) : null;
};

const Configuracion = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Configuración
        </Typography>

        <Tabs value={tabIndex} onChange={handleChange} sx={{ mb: 2 }}>
          <Tab label="Perfil" />
          <Tab label="Tema visual" />
          <Tab label="Seguridad" />
          <Tab label="Notificaciones" />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          (Aquí va la configuración del perfil)
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          (Aquí irá la configuración de tema, fuente, tamaño)
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          (Opciones de contraseña y seguridad)
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          (Activación de notificaciones)
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Configuracion;
