import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import UserMenu from "./UserMenu";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md ml-[250px]">
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer text-gray-800 dark:text-white"
        onClick={() => navigate("/")}
      >
        DR Dashboard
      </div>

      {/* Botones: tema + usuario */}
      <div className="flex items-center gap-4">
        <ThemeToggleButton />
        <UserMenu />
      </div>
    </div>
  );
};

export default Topbar;
