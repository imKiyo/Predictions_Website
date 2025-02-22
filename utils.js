export function renderPrediction(prediction) {
  const createdDate = prediction.created.toDate();
  const expiresDate = prediction.expires.toDate();
  const votes = prediction.votes || {};
  const voteCount = Object.keys(votes).length;

  return `
    <div class="prediction-box" data-id="${prediction.id}">
      <h2>${prediction.title}</h2>
      <p>${prediction.description}</p>
      <div class="prediction-details">
        <span>Created: ${createdDate.toLocaleDateString()}</span><br>
        <span>Expires: ${expiresDate.toLocaleDateString()}</span><br>
        <span class="status-${prediction.status}">Status: ${prediction.status}</span><br>
        <span>Votes: ${voteCount}</span>
      </div>
    </div>
  `;
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
