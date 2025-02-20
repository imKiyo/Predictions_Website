const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "kiyo-predictions.firebaseapp.com",
  databaseURL: "DATABASE_URL",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "kiyo-predictions.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "FIREBASE_APP_ID",
  measurementId: "MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
