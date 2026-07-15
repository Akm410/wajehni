import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAylR-JtkA7ZSokhINqZokBGoxSNrSQR1E",
  authDomain: "wajehni-8775f.firebaseapp.com",
  projectId: "wajehni-8775f",
  storageBucket: "wajehni-8775f.firebasestorage.app",
  messagingSenderId: "439952914862",
  appId: "1:439952914862:web:b5d5680dcecca607b3703f",
  measurementId: "G-4H2GGKNZTL",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  serverTimestamp,
}