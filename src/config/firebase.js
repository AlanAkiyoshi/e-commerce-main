import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "firstecommerce-be53f.firebaseapp.com",
  projectId: "firstecommerce-be53f",
  storageBucket: "firstecommerce-be53f.appspot.com",
  messagingSenderId: "608739059402",
  appId: "1:608739059402:web:e6e2dc307b3d49f0857633",
  measurementId: "G-J2WY39WXRR",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
