const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.PROJECT_ID_PLACEHOLDER + ".firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.PROJECT_ID_PLACEHOLDER + ".appspot.com",
  messagingSenderId: process.env.SENDER_ID_PLACEHOLDER,
  appId: process.env.FIREBASE_APP_ID
};

export default firebaseConfig;;
