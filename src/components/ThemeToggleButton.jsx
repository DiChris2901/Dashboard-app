import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "../contexts/ColorModeContext";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const ThemeToggleButton = () => {
  const theme = useTheme();
  const colorMode = useColorMode();
  const { currentUser } = useAuth();

  const handleToggle = async () => {
    const nuevoModo = theme.palette.mode === "light" ? "oscuro" : "claro";

    // Cambiar en el context
    colorMode.toggleColorMode();

    // Guardar en Firestore
    if (currentUser) {
      const ref = doc(db, "usuarios", currentUser.uid);
      await updateDoc(ref, {
        "theme.modo": nuevoModo,
      });
    }
  };

  return (
    <IconButton color="inherit" onClick={handleToggle}>
      {theme.palette.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggleButton;
