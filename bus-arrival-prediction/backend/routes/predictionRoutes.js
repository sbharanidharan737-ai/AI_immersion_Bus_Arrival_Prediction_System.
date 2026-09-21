const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// POST /api/predict - Submit input parameters and get ML predicted arrival time
router.post('/predict', predictionController.createPrediction);

// GET /api/history - Retrieve all previous predictions from MongoDB
router.get('/history', predictionController.getHistory);

// DELETE /api/history/:id - Delete a specific record
router.delete('/history/:id', predictionController.deletePrediction);

module.exports = router;
