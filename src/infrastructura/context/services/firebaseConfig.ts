import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDti6g6G7czPN3JTQ5-5O_y_wg2MU_qcLo",
  authDomain: "autofix-app-aca1d.firebaseapp.com",
  projectId: "autofix-app-aca1d",
  storageBucket: "autofix-app-aca1d.firebasestorage.app",
  messagingSenderId: "321470427652",
  appId: "1:321470427652:web:ca3ed6cc810182d6fafb51",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
