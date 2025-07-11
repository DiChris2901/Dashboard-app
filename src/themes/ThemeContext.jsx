// src/contexts/ThemeContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState("light");
  const [fontSize, setFontSize] = useState("normal"); // small | normal | large

  // Leer config desde Firestore
  useEffect(() => {
    const loadTheme = async () => {
      if (user?.uid) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const settings = data.settings || {};
          if (settings.theme) setMode(settings.theme);
          if (settings.fontSize) setFontSize(settings.fontSize);
        }
      }
    };
    loadTheme();
  }, [user]);

  // Cambiar tema claro/oscuro
  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (user?.uid) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { settings: { theme: newMode, fontSize } }, { merge: true });
    }
  };

  // Cambiar tamaño de fuente
  const updateFontSize = async (newSize) => {
    setFontSize(newSize);
    if (user?.uid) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { settings: { theme: mode, fontSize: newSize } }, { merge: true });
    }
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
            ? {
                background: {
                  default: "#f5f5f5",
                },
              }
            : {
                background: {
                  default: "#121212",
                },
              }),
        },
        typography: {
          fontSize: fontSizeMap[fontSize] || 14,
        },
      }),
    [mode, fontSize]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, fontSize, updateFontSize }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
