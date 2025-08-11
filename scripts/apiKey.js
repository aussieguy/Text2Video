// Function to fetch the firebase API key from the server.
async function fetchApiKey() {
  try {
    // Make a GET request to the /api/config endpoint
    const response = await fetch('/api/config');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    // Access the apiKey from the response data
    const apiKey = data.apiKey;
    // Access the firebaseApiKey from the response data
    const firebaseApiKey = data.firebaseApiKey;
    
    return [apiKey, firebaseApiKey]; // Return both apiKey and firebaseApiKey

  } catch (error) {
    console.error('Error fetching API key:', error);
    return null;
  }
}
