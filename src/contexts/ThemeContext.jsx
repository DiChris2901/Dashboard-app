// src/contexts/ThemeContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Cargar fuentes globalmente
import "@fontsource/roboto";
import "@fontsource/open-sans";
import "@fontsource/inter";
import "@fontsource/montserrat";
import "@fontsource/source-sans-pro";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const { user } = useAuth();

  const [mode, setMode] = useState("light"); // light | dark
  const [fontSize, setFontSize] = useState("normal"); // small | normal | large
  const [fontFamily, setFontFamily] = useState("Roboto"); // Roboto por defecto

  // Leer configuración del usuario al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      if (user?.uid) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const settings = snap.data().settings || {};
          if (settings.theme) setMode(settings.theme);
          if (settings.fontSize) setFontSize(settings.fontSize);
          if (settings.fontFamily) setFontFamily(settings.fontFamily);
        }
      }
    };
    loadTheme();
  }, [user]);

  // Guardar cambios en Firestore
  const saveSettings = async (settingsToUpdate) => {
    if (user?.uid) {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        { settings: { theme: mode, fontSize, fontFamily, ...settingsToUpdate } },
        { merge: true }
      );
    }
  };

  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    await saveSettings({ theme: newMode });
  };

  const updateFontSize = async (newSize) => {
    setFontSize(newSize);
    await saveSettings({ fontSize: newSize });
  };

  const updateFontFamily = async (newFamily) => {
    setFontFamily(newFamily);
    await saveSettings({ fontFamily: newFamily });
  };

  const fontSizeMap = {
    small: 12,
    normal: 14,
    large: 16,
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? { background: { default: "#f5f5f5" } }
            : { background: { default: "#121212" } }),
        },
        typography: {
          fontSize: fontSizeMap[fontSize] || 14,
          fontFamily: `'${fontFamily}', sans-serif`,
        },
      }),
    [mode, fontSize, fontFamily]
  );

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        fontSize,
        updateFontSize,
        fontFamily,
        updateFontFamily,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
