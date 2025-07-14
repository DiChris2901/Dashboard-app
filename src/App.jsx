// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Configuracion from "./pages/Configuracion";
import Dashboard from "./pages/Dashboard";
import AgregarCompromiso from "./pages/AgregarCompromiso";
import MostrarData from "./pages/MostrarData";
import AgregarPago from "./pages/AgregarPago"; // ✅ nueva vista

import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas dentro del layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agregar-compromiso" element={<AgregarCompromiso />} />
        <Route path="mostrar-data" element={<MostrarData />} />
        <Route path="agregar-pago" element={<AgregarPago />} /> {/* ✅ nueva ruta */}
      </Route>

      {/* Redirección para rutas no válidas */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
