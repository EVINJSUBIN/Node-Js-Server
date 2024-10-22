const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require('./the-ev-bdad9-firebase-adminsdk-2bvzf-617597af2f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://the-ev-bdad9-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const app = express();
const db = admin.database();
const PORT = 3000;

app.use(cors('https://evinjsubin.github.io/Humanoid_sceince-/land.html'));
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to query Firebase Realtime Database using custom API key
app.post('/fetch-data', (req, res) => {
  const { apiKey, path } = req.body;

  // Replace 'your-api-key-here' with the actual API key
  const validApiKey = 'evinistheherooftech';

  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  if (!path) {
    return res.status(400).json({ error: 'Database path is required' });
  }

  // Fetch data from Firebase Realtime Database at the specified path
  db.ref(path).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'No data found at the specified path' });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
