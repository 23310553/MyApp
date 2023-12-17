import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0KNaK0wq_K7n3O5tFjNGAP05HKpQXDBY",
  authDomain: "techincalassessment.firebaseapp.com",
  databaseURL: "https://techincalassessment-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "techincalassessment",
  storageBucket: "techincalassessment.appspot.com",
  messagingSenderId: "713680929831",
  appId: "1:713680929831:web:6b832eeb3218a2f5f77a02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);