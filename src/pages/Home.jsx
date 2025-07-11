// src/pages/Home.jsx
import { Typography, Box, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";

const Home = () => {
  const { logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esta es una página protegida. Solo puedes verla si estás autenticado.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Tema actual: {mode === "light" ? "Claro ☀️" : "Oscuro 🌙"}
        </Typography>
        <Button variant="contained" onClick={toggleTheme} sx={{ mr: 2 }}>
          Cambiar tema
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
