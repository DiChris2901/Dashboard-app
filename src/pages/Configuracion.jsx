import React from "react";
import Customizer from "../components/ThemeCustomizer/Customizer";

const Configuracion = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {/* Sección: Perfil del usuario */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Perfil</h2>
        <p className="text-gray-600">Aquí irán los datos del usuario como nombre, correo, teléfono, etc.</p>
        {/* Aquí más adelante agregaremos los campos reales de perfil */}
      </section>

      {/* Sección: Cambiar contraseña */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Seguridad</h2>
        <p className="text-gray-600">Aquí podrás cambiar tu contraseña.</p>
        {/* Aquí más adelante agregaremos formulario de cambio de contraseña */}
      </section>

      {/* Sección: Personalización visual */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Personalización Visual</h2>
        <Customizer />
      </section>

      {/* Sección: Notificaciones (pendiente por desarrollar) */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notificaciones</h2>
        <p className="text-gray-600">Aquí podrás habilitar o deshabilitar notificaciones.</p>
      </section>
    </div>
  );
};

export default Configuracion;
