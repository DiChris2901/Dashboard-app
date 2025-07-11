// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserProfile,
  saveUserProfile,
} from "../services/userService";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile(user.uid);
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setPhotoURL(data.photoURL || "");
      }
    };
    loadProfile();
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `profiles/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setPhotoURL(url);
    await saveUserProfile(user.uid, { photoURL: url });
    setUploading(false);
  };

  const handleSave = async () => {
    await saveUserProfile(user.uid, { name, phone });
    alert("Perfil actualizado");
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Perfil de usuario
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={photoURL}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            {user.email[0].toUpperCase()}
          </Avatar>
          <Button variant="outlined" component="label">
            {uploading ? <CircularProgress size={20} /> : "Subir foto"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </Button>
        </Box>

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={user.email}
          disabled
        />
        <TextField
          label="Nombre completo"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Guardar cambios
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;
