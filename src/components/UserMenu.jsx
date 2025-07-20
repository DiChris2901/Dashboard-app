import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const UserMenu = () => {
  const { user: currentUser, logout } = useAuth(); // ✅ cambio aquí
  const [anchorEl, setAnchorEl] = useState(null);
  const [fotoURL, setFotoURL] = useState(null);
  const [nombre, setNombre] = useState("");

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;
      const ref = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFotoURL(data.fotoPerfil || null);
        setNombre(data.nombre || "");
      }
    };
    fetchUser();
  }, [currentUser]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderFallback = () => {
    if (nombre) return nombre.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar
          src={fotoURL || undefined}
          sx={{ width: 40, height: 40, bgcolor: "#7e22ce" }}
        >
          {!fotoURL && renderFallback()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem disabled>👤 Perfil</MenuItem>
        <MenuItem onClick={() => { navigate("/configuracion"); handleMenuClose(); }}>
          ⚙️ Configuración
        </MenuItem>
        <MenuItem onClick={handleLogout}>🚪 Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
