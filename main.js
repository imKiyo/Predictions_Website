import { db } from './keys.js';

// Function to read data from the database
function readData() {
  const dbRef = db.collection('predictions');
  dbRef.get().then((snapshot) => {
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data); // Log data to the console
    document.getElementById('predictions-container').innerText = JSON.stringify(data, null, 2);
  });
}

// Call the function to read data
readData();
