// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const grievanceRoutes = require('./routes/grievanceRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from uploads folder

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/railmadad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api/grievances', grievanceRoutes);
app.use('/api', grievanceRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});