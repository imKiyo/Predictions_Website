import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter, where, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastVisible = null; // For pagination
const predictionsContainer = document.getElementById('predictions-container');

function renderPrediction(prediction) {
  const createdDate = prediction.created.toDate();
  const expiresDate = prediction.expires.toDate();
  return `
    <div class="prediction-box" data-id="${prediction.id}">
      <h2>${prediction.title}</h2>
      <p>${prediction.description}</p>
      <div class="time-status">
        <span>Created: ${createdDate.toLocaleDateString()}</span><br>
        <span>Expires: ${expiresDate.toLocaleDateString()}</span><br>
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

// Example Queries

// Get recent predictions
async function getRecentPredictions() {
  const q = query(collection(db, 'predictions'), orderBy('created', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Get predictions by category
async function getPredictionsByCategory(category) {
  const q = query(collection(db, 'predictions'), where('category', '==', category), orderBy('created', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Get user's predictions
async function getUserPredictions(userId) {
  const q = query(collection(db, 'predictions'), where('authorId', '==', userId), orderBy('created', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Get expiring soon predictions
async function getExpiringPredictions(futureDate) {
  const q = query(collection(db, 'predictions'), where('status', '==', 'active'), where('expires', '<=', Timestamp.fromDate(new Date(futureDate))), orderBy('expires'), limit(10));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

// Initialize
loadPredictions();
