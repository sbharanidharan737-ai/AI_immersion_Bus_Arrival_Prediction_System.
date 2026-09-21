const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    trim: true,
    uppercase: true
  },
  source: {
    type: String,
    required: [true, 'Source location is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination location is required'],
    trim: true
  },
  distance: {
    type: Number,
    required: [true, 'Distance in kilometers is required'],
    min: [0.1, 'Distance must be greater than 0']
  },
  traffic: {
    type: String,
    required: [true, 'Traffic condition is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Traffic must be Low, Medium, or High'
    }
  },
  time: {
    type: String,
    required: [true, 'Current time is required']
  },
  busFrequency: {
    type: Number,
    required: [true, 'Bus frequency is required'],
    min: [1, 'Bus frequency must be at least 1 minute']
  },
  predictedArrival: {
    type: Number,
    required: [true, 'Predicted arrival time is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
