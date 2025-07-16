import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TableViewIcon from "@mui/icons-material/TableView";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Resumen" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/agregar-compromiso")}>
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            <ListItemText primary="Agregar Compromiso" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/mostrar-data")}>
            <ListItemIcon><TableViewIcon /></ListItemIcon>
            <ListItemText primary="Mostrar Data" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
