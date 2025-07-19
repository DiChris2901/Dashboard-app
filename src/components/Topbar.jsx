import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: "calc(100% - 250px)",
        ml: "250px",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", pl: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          DR Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ThemeToggle />
          <IconButton onClick={handleMenuOpen}>
            <Avatar alt="U" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>Usuario</MenuItem>
            <MenuItem>Perfil</MenuItem>
            <MenuItem>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
