import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Avatar } from "@mui/material";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [fotoPreview, setFotoPreview] = useState(null);
  const [nombrePreview, setNombrePreview] = useState("");

  const navigate = useNavigate();

  const buscarUsuarioPorCorreo = async (email) => {
    if (!email.includes("@")) return; // filtro simple
    try {
      const q = query(collection(db, "usuarios"), where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setFotoPreview(data.fotoPerfil || null);
        setNombrePreview(data.nombre || "");
      } else {
        setFotoPreview(null);
        setNombrePreview("");
      }
    } catch (error) {
      console.error("Error buscando usuario:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      navigate("/");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Iniciar Sesión
        </h2>

        {/* Vista previa de la foto */}
        {correo && (
          <div className="flex justify-center mb-4">
            <Avatar
              src={fotoPreview || undefined}
              sx={{
                width: 80,
                height: 80,
                fontSize: 32,
                bgcolor: "#7e22ce",
              }}
            >
              {!fotoPreview &&
                (nombrePreview
                  ? nombrePreview.charAt(0).toUpperCase()
                  : correo.charAt(0).toUpperCase())}
            </Avatar>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                buscarUsuarioPorCorreo(e.target.value);
              }}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
