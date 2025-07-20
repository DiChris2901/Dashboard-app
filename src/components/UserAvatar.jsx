import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const UserAvatar = ({ size = 40 }) => {
  const { currentUser } = useAuth();
  const [fotoURL, setFotoURL] = useState(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const ref = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFotoURL(data.fotoPerfil || null);
        setNombre(data.nombre || "");
      }
    };
    fetchUserData();
  }, [currentUser]);

  const renderFallback = () => {
    if (nombre) return nombre.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <Avatar
      src={fotoURL || undefined}
      sx={{
        width: size,
        height: size,
        bgcolor: "#7e22ce", // fallback color
        fontSize: size * 0.5,
      }}
    >
      {!fotoURL && renderFallback()}
    </Avatar>
  );
};

export default UserAvatar;
