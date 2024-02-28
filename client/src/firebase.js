// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "investinspace-cf880.firebaseapp.com",
  projectId: "investinspace-cf880",
  storageBucket: "investinspace-cf880.appspot.com",
  messagingSenderId: "407862306446",
  appId: "1:407862306446:web:eaf228a794113b383e4bdf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);