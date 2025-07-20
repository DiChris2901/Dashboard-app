// Paso 4.1: Customizador visual del usuario con integración Firebase

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const Customizer = () => {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState({
    modo: "claro",
    fuente: "sans",
    colorPrimario: "#1e40af",
    borde: "rounded-md",
    fondo: "bg-white"
  });

  useEffect(() => {
    const fetchTheme = async () => {
      if (!currentUser) return;
      const ref = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().theme) {
        setTheme(snap.data().theme);
      }
    };
    fetchTheme();
  }, [currentUser]);

  const updateTheme = async (key, value) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    if (!currentUser) return;
    const ref = doc(db, "usuarios", currentUser.uid);
    await setDoc(ref, { theme: newTheme }, { merge: true });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Personalización Visual</h2>

      <div>
        <label className="block mb-1">Modo</label>
        <select
          value={theme.modo}
          onChange={(e) => updateTheme("modo", e.target.value)}
          className="p-2 border rounded"
        >
          <option value="claro">Claro</option>
          <option value="oscuro">Oscuro</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Fuente</label>
        <select
          value={theme.fuente}
          onChange={(e) => updateTheme("fuente", e.target.value)}
          className="p-2 border rounded"
        >
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Color Primario</label>
        <input
          type="color"
          value={theme.colorPrimario}
          onChange={(e) => updateTheme("colorPrimario", e.target.value)}
          className="w-12 h-8 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Borde</label>
        <select
          value={theme.borde}
          onChange={(e) => updateTheme("borde", e.target.value)}
          className="p-2 border rounded"
        >
          <option value="rounded-none">Sin bordes</option>
          <option value="rounded-md">Medio</option>
          <option value="rounded-xl">Grande</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Fondo</label>
        <select
          value={theme.fondo}
          onChange={(e) => updateTheme("fondo", e.target.value)}
          className="p-2 border rounded"
        >
          <option value="bg-white">Blanco</option>
          <option value="bg-gray-100">Gris Claro</option>
          <option value="bg-gradient-to-r from-indigo-500 to-purple-500">
            Gradiente Indigo-Púrpura
          </option>
        </select>
      </div>
    </div>
  );
};

export default Customizer;
