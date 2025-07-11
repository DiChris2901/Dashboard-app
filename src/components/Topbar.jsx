// src/components/Topbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const initials = user?.email?.[0]?.toUpperCase() || "U";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const goToPerfil = () => {
    handleMenuClose();
    navigate("/perfil");
  };

  const goToConfiguracion = () => {
    handleMenuClose();
    navigate("/configuracion");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#fff" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Inicio
        </Typography>

        <Box>
          <IconButton onClick={handleMenuOpen}>
            <Avatar>{initials}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={goToPerfil}>Perfil</MenuItem>
            <MenuItem onClick={goToConfiguracion}>Configuración</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
