import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AgregarCompromiso from "./pages/AgregarCompromiso";
import MostrarData from "./pages/MostrarData";
import AgregarPago from "./pages/AgregarPago";
import Configuracion from "./pages/Configuracion";
import Login from "./pages/Login";
import Layout from "./layouts/Layout"; // Tu layout base con Sidebar + Topbar

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("user"); // ejemplo básico, usa context o firebase
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agregar-compromiso" element={<AgregarCompromiso />} />
          <Route path="mostrar-data" element={<MostrarData />} />
          <Route path="agregar-pago" element={<AgregarPago />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
