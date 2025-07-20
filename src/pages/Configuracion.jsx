import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Customizer from "../components/ThemeCustomizer/Customizer";
import FotoPerfilUploader from "../components/Perfil/FotoPerfilUploader";

const Configuracion = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({ nombre: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;
      const ref = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserData({
          nombre: data.nombre || "Sin nombre",
          email: data.email || currentUser.email,
        });
      } else {
        setUserData({
          nombre: "Sin nombre",
          email: currentUser.email,
        });
      }
    };
    fetchUser();
  }, [currentUser]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {/* Perfil */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Perfil</h2>

        <div className="mb-4">
          <p><span className="font-medium">Nombre:</span> {userData.nombre}</p>
          <p><span className="font-medium">Correo:</span> {userData.email}</p>
        </div>

        <FotoPerfilUploader />
      </section>

      {/* Seguridad */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Seguridad</h2>
        <p className="text-gray-600">Aquí podrás cambiar tu contraseña.</p>
        {/* A futuro: cambiar contraseña */}
      </section>

      {/* Personalización visual */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Personalización Visual</h2>
        <Customizer />
      </section>

      {/* Notificaciones */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notificaciones</h2>
        <p className="text-gray-600">Aquí podrás habilitar o deshabilitar notificaciones.</p>
      </section>
    </div>
  );
};

export default Configuracion;
