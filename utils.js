export function renderPrediction(prediction) {
  let createdDate, expiresDate;

  if (prediction.created instanceof Date) {
    createdDate = prediction.created;
  } else if (prediction.created && prediction.created.toDate) {
    createdDate = prediction.created.toDate();
  } else {
    createdDate = new Date(); // Default to current date if undefined
  }

  if (prediction.expires instanceof Date) {
    expiresDate = prediction.expires;
  } else if (prediction.expires && prediction.expires.toDate) {
    expiresDate = prediction.expires.toDate();
  } else {
    expiresDate = new Date(); // Default to current date if undefined
  }

  const votes = prediction.votes || {};
  const voteCount = Object.keys(votes).length;

  return `
    <div class="prediction-box" data-id="${prediction.id}">
      <div class="prediction-content">
        <h2>${prediction.title}</h2>
        <p>${prediction.description}</p>
      </div>
      <div class="prediction-details">
        <div>Created: ${createdDate.toLocaleDateString()}</div>
        <div>Expires: ${expiresDate.toLocaleDateString()}</div>
        <div class="status-${prediction.status}">Status: ${prediction.status}</div>
        <div>Votes: ${voteCount}</div>
      </div>
    </div>
  `;
}
