require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pocketnote API' });
});

// API Routes
// API Routes
app.use('/api/notes', require('./routes/notes'));
app.use('/api/bookmarks', require('./routes/bookmarks')); 
app.use('/api/events', require('./routes/events'));
// app.use('/api/auth', require('./routes/auth')); // Removed

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
