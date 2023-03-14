import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPm8qpiUVAUJOoHYn2pXPSRCh_us3KSek",
  authDomain: "fermiprotocol.firebaseapp.com",
  projectId: "fermiprotocol",
  storageBucket: "fermiprotocol.appspot.com",
  messagingSenderId: "691338486912",
  appId: "1:691338486912:web:2dfbae9de25e7b308ab265",
  measurementId: "G-9RNC43Q25L"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebase_app);

export default firebase_app;
