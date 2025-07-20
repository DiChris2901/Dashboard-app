import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const FotoPerfilUploader = () => {
  const { currentUser } = useAuth();
  const [fotoURL, setFotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFoto = async () => {
      if (!currentUser) return;
      const refDoc = doc(db, "usuarios", currentUser.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists() && snap.data().fotoPerfil) {
        setFotoURL(snap.data().fotoPerfil);
      }
    };
    fetchFoto();
  }, [currentUser]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `fotosPerfil/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const refDoc = doc(db, "usuarios", currentUser.uid);
      await updateDoc(refDoc, { fotoPerfil: downloadURL });

      setFotoURL(downloadURL);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Foto de Perfil</h2>

      <div className="flex items-center gap-4">
        <img
          src={fotoURL || "https://via.placeholder.com/100x100.png?text=Foto"}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <label className="block mb-1 font-medium">Cambiar foto</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {loading && <p className="text-sm text-gray-500 mt-1">Subiendo...</p>}
        </div>
      </div>
    </div>
  );
};

export default FotoPerfilUploader;
