// src/pages/Configuracion.jsx
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useThemeMode } from "../contexts/ThemeContext";

const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 2 }}>
      <Typography>{children}</Typography>
    </Box>
  ) : null;
};

const Configuracion = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { mode, toggleTheme, fontSize, updateFontSize } = useThemeMode();

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
          <Typography variant="subtitle1" gutterBottom>
            Tema actual: {mode === "light" ? "Claro ☀️" : "Oscuro 🌙"}
          </Typography>
          <Button variant="outlined" onClick={toggleTheme} sx={{ mb: 3 }}>
            Cambiar tema
          </Button>

          <Typography variant="subtitle1" gutterBottom>
            Tamaño de letra:
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={fontSize === "small" ? "contained" : "outlined"}
              onClick={() => updateFontSize("small")}
            >
              Pequeño
            </Button>
            <Button
              variant={fontSize === "normal" ? "contained" : "outlined"}
              onClick={() => updateFontSize("normal")}
            >
              Normal
            </Button>
            <Button
              variant={fontSize === "large" ? "contained" : "outlined"}
              onClick={() => updateFontSize("large")}
            >
              Grande
            </Button>
          </Box>
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
