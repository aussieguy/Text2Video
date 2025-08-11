// Initial setup commands:
// npx license mit
// npx gitignore node
// npx covgen YOUR_EMAIL_ADDRESS
// npm init -y
// npm install express cors nodemon
// Create an index.html
// To run the server, use the command:
// nodemon server.js


const express = require('express');
const cors = require('cors');
const path = require('path');
 require('dotenv').config();    // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve front page for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Create an API endpoint to return environment variable
// This endpoint will respond with a JSON object containing the apiKey
// app.get('/api/config', ...) - This creates a route handler for HTTP GET requests to the path /api/config. When a client makes a GET request to this URL, the callback function will be executed.

// (req, res) => { ... } - This is the callback function with two parameters:

// req: The request object containing information about the HTTP request
// res: The response object used to send back data to the client
// res.json({ apiKey: process.env.apiKey }) - This sends a JSON response back to the client:

// It creates a JavaScript object with a property named apiKey
// The value comes from process.env.apiKey, which reads the environment variable named apiKey
// res.json() automatically converts the JavaScript object to JSON format and sets the appropriate Content-Type header

// NOTE: Make sure to set the environment variable apiKey in your .env file or your server environment before running this code.
// Also, run npm install dotenv to use the dotenv package for loading environment variables from a .env file.
// require('dotenv').config();
app.get('/api/config', (req, res) => {
    res.json({ apiKey: process.env.apiKey, firebaseApiKey: process.env.firebaseApiKey });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
