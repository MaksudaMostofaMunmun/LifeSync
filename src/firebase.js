import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc4rkcL65goduiYVf-p3C_qlsafXOcBKU",
  authDomain: "lifesync-206ee.firebaseapp.com",
  projectId: "lifesync-206ee",
  storageBucket: "lifesync-206ee.firebasestorage.app",
  messagingSenderId: "271898926527",
  appId: "1:271898926527:web:0c6e325150b05d9c48d50a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);