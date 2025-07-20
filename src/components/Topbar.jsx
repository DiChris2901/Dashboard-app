import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      {/* Logo o nombre de la app */}
      <div
        className="text-2xl font-bold cursor-pointer text-gray-800 dark:text-white"
        onClick={() => navigate("/")}
      >
        DR Dashboard
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-4">
        {/* Botón de tema claro/oscuro */}
        <ThemeToggleButton />

        {/* Aquí se puede agregar botón de usuario (Perfil, Configuración, Cerrar sesión) más adelante */}
      </div>
    </div>
  );
};

export default Topbar;
