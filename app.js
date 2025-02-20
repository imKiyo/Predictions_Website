// Fetch predictions from Firestore
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
function loadPredictions() {
  db.collection("predictions")
    .orderBy("created", "desc")
    .limit(5)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const prediction = doc.data();
        predictionsContainer.innerHTML += renderPrediction({ id: doc.id, ...prediction });
      });
      lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    });
}

// Load more predictions
document.getElementById('loadMore').addEventListener('click', () => {
  db.collection("predictions")
    .orderBy("created", "desc")
    .startAfter(lastVisible)
    .limit(5)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const prediction = doc.data();
        predictionsContainer.innerHTML += renderPrediction({ id: doc.id, ...prediction });
      });
      lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    });
});

// Initialize
loadPredictions();
