import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTkXaEPz__0Y1F5apD8VHB0_hxkByd454",
  authDomain: "control-financiero-drgro-b0e70.firebaseapp.com",
  projectId: "control-financiero-drgro-b0e70",
  storageBucket: "control-financiero-drgro-b0e70.firebasestorage.app",
  messagingSenderId: "796279649420",
  appId: "1:796279649420:web:21d424caf7c5e881cd37a9"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
