// src/services/userService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Obtener perfil de usuario
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Guardar perfil de usuario
export const saveUserProfile = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
};
