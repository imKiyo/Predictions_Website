export function renderPrediction(prediction) {
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
