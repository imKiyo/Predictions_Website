import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs, where, startAfter, Timestamp } from 'firebase/firestore';
import { renderPrediction, debounce } from './utils.js';

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

let lastVisible = null;
const predictionsContainer = document.getElementById('predictions-container');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortSelect = document.getElementById('sortBy');
const filterSelect = document.getElementById('filterBy');

// Load initial predictions
async function loadPredictions() {
  try {
    const filter = filterSelect.value;
    const sort = sortSelect.value;

    let q = query(
      collection(db, 'predictions'),
      orderBy(sort, sort === 'desc' ? 'desc' : 'asc'),
      limit(5)
    );

    if (filter !== 'all') {
      q = query(q, where('status', '==', filter));
    }

    const querySnapshot = await getDocs(q);
    predictionsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const prediction = { id: doc.id, ...doc.data() };
      predictionsContainer.innerHTML += renderPrediction(prediction);
    });

    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  } catch (error) {
    predictionsContainer.innerHTML = `
      <div class="error-message">Failed to load predictions. Please try again later.</div>
    `;
    console.error('Error loading predictions:', error);
  }
}

// Load more predictions
async function loadMore() {
  if (!lastVisible) return;

  try {
    const filter = filterSelect.value;
    const sort = sortSelect.value;

    let q = query(
      collection(db, 'predictions'),
      orderBy(sort, sort === 'desc' ? 'desc' : 'asc'),
      startAfter(lastVisible),
      limit(5)
    );

    if (filter !== 'all') {
      q = query(q, where('status', '==', filter));
    }

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const prediction = { id: doc.id, ...doc.data() };
      predictionsContainer.innerHTML += renderPrediction(prediction);
    });

    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  } catch (error) {
    console.error('Error loading more predictions:', error);
  }
}

// Search predictions
async function searchPredictions(searchTerm) {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    predictionsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const prediction = { id: doc.id, ...doc.data() };
      predictionsContainer.innerHTML += renderPrediction(prediction);
    });
  } catch (error) {
    console.error('Error searching predictions:', error);
  }
}

// Event listeners
document.getElementById('loadMore').addEventListener('click', loadMore);
searchButton.addEventListener('click', () => searchPredictions(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchPredictions(searchInput.value);
  }
});
sortSelect.addEventListener('change', loadPredictions);
filterSelect.addEventListener('change', loadPredictions);

// Initialize
loadPredictions();
