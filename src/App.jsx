// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Configuracion from "./pages/Configuracion";
import Dashboard from "./pages/Dashboard"; // ✅ Nuevo import

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
        <Route path="dashboard" element={<Dashboard />} /> {/* ✅ Nueva ruta */}
      </Route>

      {/* Redirección para rutas no válidas */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
