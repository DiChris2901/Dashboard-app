import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const ThemeManager = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const applyTheme = async () => {
      if (!currentUser) return;

      const ref = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists() || !snap.data().theme) return;

      const theme = snap.data().theme;

      // Limpiar clases anteriores si existían
      document.body.className = "";

      // Aplicar clases de fondo, fuente, bordes
      document.body.classList.add(theme.fondo || "bg-white");
      document.body.classList.add(`font-${theme.fuente || "sans"}`);
      document.body.classList.add(theme.borde || "rounded-md");

      // Aplicar modo oscuro si corresponde
      if (theme.modo === "oscuro") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Aplicar color primario como variable CSS
      document.documentElement.style.setProperty(
        "--color-primary",
        theme.colorPrimario || "#1e40af"
      );
    };

    applyTheme();
  }, [currentUser]);

  return null; // no renderiza nada, solo aplica estilos
};

export default ThemeManager;
