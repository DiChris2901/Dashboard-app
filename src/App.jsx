import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ColorModeProvider } from "./contexts/ColorModeContext";

import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import AgregarCompromiso from "./pages/AgregarCompromiso";
import AgregarPago from "./pages/AgregarPago";
import MostrarData from "./pages/MostrarData";
import Configuracion from "./pages/Configuracion";

import Layout from "./layouts/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ThemeManager from "./components/ThemeCustomizer/ThemeManager";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ColorModeProvider>
          <ThemeManager /> {/* Aplica el tema del usuario automáticamente */}

          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas con layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Inicio />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agregar-compromiso" element={<AgregarCompromiso />} />
              <Route path="agregar-pago" element={<AgregarPago />} />
              <Route path="mostrar-data" element={<MostrarData />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
        </ColorModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
