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

  // Cargar configuración desde Firestore
  useEffect(() => {
    const loadTheme = async () => {
      if (user?.uid) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.settings?.theme) {
            setMode(data.settings.theme);
          }
        }
      }
    };
    loadTheme();
  }, [user]);

  // Guardar en Firestore cuando se cambia
  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (user?.uid) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { settings: { theme: newMode } }, { merge: true });
    }
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
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
