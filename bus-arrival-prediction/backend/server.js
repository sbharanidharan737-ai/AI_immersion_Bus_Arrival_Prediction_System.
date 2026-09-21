require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus_arrival_db';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for college demonstration and debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Bus Arrival Time Prediction API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Fallback Mode',
    timestamp: new Date()
  });
});

// Mount Prediction Routes
app.use('/api', predictionRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.send(`
    <h2>🚌 BUS ARRIVAL TIME PREDICTION SYSTEM - BACKEND API</h2>
    <p>Endpoints:</p>
    <ul>
      <li><code>POST /api/predict</code> - Predict bus arrival time</li>
      <li><code>GET /api/history</code> - Fetch prediction history</li>
      <li><code>GET /api/health</code> - Service health check</li>
    </ul>
  `);
});

// MongoDB Connection Setup with Graceful Offline Handling
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('✅ [MongoDB] Successfully connected to database:', MONGO_URI);
  } catch (err) {
    console.warn('⚠️  [MongoDB] Database connection warning:', err.message);
    console.warn('ℹ️  [MongoDB] Running with in-memory persistence fallback. Start mongod or update MONGO_URI in .env for persistent storage.');
  }
};

connectDatabase();

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Bus Arrival Prediction Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log('====================================================');
});

module.exports = app;
