import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDORVx5nrOY6jTGpa9QmDQ-4EZVvgFVtgs",
  authDomain: "jrwm2024.firebaseapp.com",
  projectId: "jrwm2024",
  storageBucket: "jrwm2024.appspot.com",
  messagingSenderId: "803761899977",
  appId: "1:803761899977:web:61348b1c613fcfbff44018",
  measurementId: "G-4CF19MW3RN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const database = getFirestore(app);
