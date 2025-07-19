import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <>
      <Topbar />
      <Box display="flex">
        <Box sx={{ width: 250, mt: "64px" }}>
          <Sidebar />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, mt: "64px", p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
