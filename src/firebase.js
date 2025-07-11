// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZfGLK26TCsJexKsL8an0PC9j4MZInOFM",
  authDomain: "pagos-empresas-31568.firebaseapp.com",
  projectId: "pagos-empresas-31568",
  storageBucket: "pagos-empresas-31568.firebasestorage.app",
  messagingSenderId: "334077020861",
  appId: "1:334077020861:web:4aba86e3181f32e1f405d4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
