import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext } from "./contexts/ColorModeContext";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgregarCompromiso from "./pages/AgregarCompromiso";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { theme } = useContext(ColorModeContext);
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Inicio />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agregar-compromiso" element={<AgregarCompromiso />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
