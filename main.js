import { db } from './keys.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Function to read data from the database
async function readData() {
  const q = query(collection(db, 'predictions'), orderBy('created', 'desc'));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => doc.data());
  console.log(data); // Log data to the console
  document.getElementById('predictions-container').innerText = JSON.stringify(data, null, 2);
}

// Call the function to read data
readData();
