export function renderPrediction(prediction) {
  const createdDate = prediction.created.toDate();
  const expiresDate = prediction.expires.toDate();
  const evidence = prediction.evidence || 'No evidence provided';
  const votes = prediction.votes || {};
  const voteCount = Object.keys(votes).length;

  return `
    <div class="prediction-box" data-id="${prediction.id}">
      <h2>${prediction.title}</h2>
      <p>${prediction.description}</p>
      <div class="evidence">
        <strong>Evidence:</strong> ${evidence}
      </div>
      <div class="time-status">
        <span>Created: ${createdDate.toLocaleDateString()}</span><br>
        <span>Expires: ${expiresDate.toLocaleDateString()}</span><br>
        <span class="status-${prediction.status}">Status: ${prediction.status}</span>
      </div>
      <div class="votes">
        <strong>Votes: ${voteCount}</strong>
      </div>
      <button class="copy-link" onclick="copyLink('${prediction.id}')">Copy Link</button>
      <button class="view-votes" onclick="viewVotes('${prediction.id}')">View Votes</button>
    </div>
  `;
}

export function copyLink(predictionId) {
  const url = `${window.location.origin}/prediction/${predictionId}`;
  navigator.clipboard.writeText(url)
    .then(() => alert('Link copied to clipboard!'))
    .catch(err => console.error('Failed to copy link: ', err));
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to view votes (example implementation)
export async function viewVotes(predictionId) {
  const votesContainer = document.getElementById('votes-container');
  const votesQuery = query(collection(db, `predictions/${predictionId}/votes`));
  const querySnapshot = await getDocs(votesQuery);

  votesContainer.innerHTML = `
    <h3>Votes for Prediction: ${predictionId}</h3>
    <ul>
  `;

  querySnapshot.forEach((doc) => {
    const vote = doc.data();
    votesContainer.innerHTML += `
      <li>
        <strong>User: ${doc.id}</strong><br>
        <span>Timestamp: ${vote.timestamp.toDate().toLocaleDateString()}</span><br>
        <span>Value: ${vote.value}</span>
      </li>
    `;
  });

  votesContainer.innerHTML += '</ul>';
}
