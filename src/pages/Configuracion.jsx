// src/pages/Configuracion.jsx
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useThemeMode } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";

const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 2 }}>
      <Typography>{children}</Typography>
    </Box>
  ) : null;
};

const Configuracion = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    mode,
    toggleTheme,
    fontSize,
    updateFontSize,
    fontFamily,
    updateFontFamily,
  } = useThemeMode();
  const { user } = useAuth();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleChangePassword = async () => {
    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    const feedback = document.getElementById("passwordFeedback");

    feedback.textContent = "";

    if (newPass !== confirm) {
      feedback.textContent = "Las contraseñas nuevas no coinciden.";
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPass);
      feedback.style.color = "green";
      feedback.textContent = "Contraseña actualizada exitosamente.";
    } catch (error) {
      feedback.textContent =
        "Error: " + (error.message || "no se pudo cambiar la contraseña.");
    }
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

        {/* PERFIL */}
        <TabPanel value={tabIndex} index={0}>
          (Aquí va la configuración del perfil)
        </TabPanel>

        {/* TEMA VISUAL */}
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
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
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

          <Typography variant="subtitle1" gutterBottom>
            Fuente tipográfica:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Fuente</InputLabel>
            <Select
              value={fontFamily}
              label="Fuente"
              onChange={(e) => updateFontFamily(e.target.value)}
            >
              <MenuItem value="Roboto">Roboto</MenuItem>
              <MenuItem value="Open Sans">Open Sans</MenuItem>
              <MenuItem value="Inter">Inter</MenuItem>
              <MenuItem value="Montserrat">Montserrat</MenuItem>
              <MenuItem value="Source Sans Pro">Source Sans Pro</MenuItem>
            </Select>
          </FormControl>
        </TabPanel>

        {/* SEGURIDAD */}
        <TabPanel value={tabIndex} index={2}>
          <Typography variant="subtitle1" gutterBottom>
            Cambiar contraseña
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <input
              type="password"
              placeholder="Contraseña actual"
              id="currentPassword"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              id="newPassword"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              id="confirmPassword"
            />
            <Button variant="contained" onClick={handleChangePassword}>
              Guardar nueva contraseña
            </Button>
            <Typography id="passwordFeedback" variant="body2" color="error" />
          </Box>
        </TabPanel>

        {/* NOTIFICACIONES */}
        <TabPanel value={tabIndex} index={3}>
          (Activación de notificaciones)
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Configuracion;
