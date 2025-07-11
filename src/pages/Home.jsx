// src/pages/Home.jsx
import { Typography, Box, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { logout } = useAuth();

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
      <Button variant="outlined" color="secondary" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Box>
  );
};

export default Home;
