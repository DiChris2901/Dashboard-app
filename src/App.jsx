import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext } from "./contexts/ColorModeContext";
import MainLayout from "./layouts/MainLayout";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { theme } = useContext(ColorModeContext); // <- importante

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
