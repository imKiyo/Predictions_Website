import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastVisible = null; // For pagination
const predictionsContainer = document.getElementById('predictions-container');

function renderPrediction(prediction) {
  return `
    <div class="prediction-box" data-id="${prediction.id}">
      <h2>${prediction.title}</h2>
      <p>${prediction.description}</p>
      <div class="time-status">
        <span>Created: ${prediction.created}</span><br>
        <span>Expires: ${prediction.expires}</span><br>
        <span class="status-${prediction.status}">Status: ${prediction.status}</span>
      </div>
      <button class="copy-link" onclick="copyLink('${prediction.id}')">Copy Link</button>
    </div>
  `;
}

// Load initial predictions
async function loadPredictions() {
  const q = query(collection(db, 'predictions'), orderBy('created', 'desc'), limit(5));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const prediction = doc.data();
    predictionsContainer.innerHTML += renderPrediction({ id: doc.id, ...prediction });
  });
  lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
}

// Load more predictions
document.getElementById('loadMore').addEventListener('click', async () => {
  if (!lastVisible) return; // Prevent further calls if no more documents are left
  const q = query(collection(db, 'predictions'), orderBy('created', 'desc'), startAfter(lastVisible), limit(5));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const prediction = doc.data();
    predictionsContainer.innerHTML += renderPrediction({ id: doc.id, ...prediction });
  });
  lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
});

// Initialize
loadPredictions();
