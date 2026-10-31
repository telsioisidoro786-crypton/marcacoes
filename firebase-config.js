/* ============================================================
   Configuração do Firebase — o ÚNICO ficheiro que precisas de editar.
   Firebase Console → Definições do projeto → "As suas apps" → Web (</>)
   → copia o objeto firebaseConfig e cola os valores abaixo.
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const firebaseConfig = {
   apiKey: "AIzaSyA-7my3ETw4ewqBtHylaLVKfkS4VtFsc-Q",
  authDomain: "marcacoes-42307.firebaseapp.com",
  projectId: "marcacoes-42307",
  storageBucket: "marcacoes-42307.firebasestorage.app",
  messagingSenderId: "640118521080",
  appId: "1:640118521080:web:e234b69bf40f5a4d494f0d"
};

export const configurado = !String(firebaseConfig.apiKey).startsWith("COLE");
export const app = configurado ? initializeApp(firebaseConfig) : null;
export const db = configurado ? getFirestore(app) : null;

export {
  doc, getDoc, setDoc, updateDoc, getDocs, collection, query, where,
  onSnapshot, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
