/* ============================================================
   Configuração do Firebase — o ÚNICO ficheiro que precisas de editar.
   Firebase Console → Definições do projeto → "As suas apps" → Web (</>)
   → copia o objeto firebaseConfig e cola os valores abaixo.
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI.firebaseapp.com",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI.appspot.com",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

export const configurado = !String(firebaseConfig.apiKey).startsWith("COLE");
export const app = configurado ? initializeApp(firebaseConfig) : null;
export const db = configurado ? getFirestore(app) : null;

export {
  doc, getDoc, setDoc, updateDoc, getDocs, collection, query, where,
  onSnapshot, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
