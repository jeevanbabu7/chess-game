// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4hIHzZinb7eVzde_NcaiEfWurfz-wrhs",
  authDomain: "chess-game-cc6c9.firebaseapp.com",
  projectId: "chess-game-cc6c9",
  storageBucket: "chess-game-cc6c9.appspot.com",
  messagingSenderId: "659971157396",
  appId: "1:659971157396:web:600c9d694dc712e3693381",
  measurementId: "G-HDFQWFY5RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;