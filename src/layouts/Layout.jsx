import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <>
      {/* Topbar va por fuera */}
      <Topbar />

      {/* Contenido principal con Sidebar */}
      <Box display="flex">
        <Box sx={{ width: 250 }}>
          <Sidebar />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
