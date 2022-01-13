import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrMBr1bWNXIMziWVyt59bm7AXEMhg4gY4",
  authDomain: "zonghong-whatsapp.firebaseapp.com",
  projectId: "zonghong-whatsapp",
  storageBucket: "zonghong-whatsapp.appspot.com",
  messagingSenderId: "848095527134",
  appId: "1:848095527134:web:642d2101ab473fd0ea824f",
  measurementId: "G-N6GRZ4ZMKN",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { app, db, auth, storage };

{
  /**const firebaseConfig = {
  apiKey: "AIzaSyBrMBr1bWNXIMziWVyt59bm7AXEMhg4gY4",
  authDomain: "zonghong-whatsapp.firebaseapp.com",
  projectId: "zonghong-whatsapp",
  storageBucket: "zonghong-whatsapp.appspot.com",
  messagingSenderId: "848095527134",
  appId: "1:848095527134:web:642d2101ab473fd0ea824f",
  meas */
}
