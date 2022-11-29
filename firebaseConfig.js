import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv-8CClCJ7uEtkvym9Vd_J_px5OfcpiXY",
  authDomain: "great-calendar-7d947.firebaseapp.com",
  projectId: "great-calendar-7d947",
  storageBucket: "great-calendar-7d947.appspot.com",
  messagingSenderId: "147422113889",
  appId: "1:147422113889:web:b215e90b6edfab0775fa20",
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
