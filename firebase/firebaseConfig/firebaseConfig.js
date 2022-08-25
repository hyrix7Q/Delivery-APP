import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnOD6zPaei2i8VvLk9wR6TMio4rEYUK3A",
  authDomain: "mini-projet-d1c74.firebaseapp.com",
  projectId: "mini-projet-d1c74",
  storageBucket: "mini-projet-d1c74.appspot.com",
  messagingSenderId: "189482816718",
  appId: "1:189482816718:web:434453e9d87c23af80ac9f",
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
