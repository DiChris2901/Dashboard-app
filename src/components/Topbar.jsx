import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import UserAvatar from "./UserAvatar";

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

        {/* Avatar del usuario */}
        <div className="cursor-pointer" onClick={() => navigate("/configuracion")}>
          <UserAvatar size={40} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
