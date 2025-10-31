// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo0TBKKryi2hIiRfAk3o1EclNvCYJ5KjQ",
  authDomain: "console.firebase.google.com/project/paydate-7ddc2/firestore",
  projectId: "paydate-7ddc2",
  storageBucket: "paydate-7ddc2.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "SEU_APP_ID",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
export const db = getFirestore(app);
