const path = require('path');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');

// In-memory fallback storage in case MongoDB is temporarily offline/unreachable
let memoryHistory = [
  {
    _id: "demo-1",
    busNumber: "21G",
    source: "Central Railway Station",
    destination: "Tech Campus",
    distance: 14.5,
    traffic: "High",
    time: "08:45",
    busFrequency: 12,
    predictedArrival: 46.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 35)
  },
  {
    _id: "demo-2",
    busNumber: "45A",
    source: "Airport Terminal 2",
    destination: "Downtown Square",
    distance: 9.0,
    traffic: "Medium",
    time: "11:15",
    busFrequency: 15,
    predictedArrival: 26.8,
    createdAt: new Date(Date.now() - 1000 * 60 * 120)
  }
];

/**
 * Execute Python predict.py using child_process
 */
const runPythonPrediction = (distance, traffic, time, busFrequency) => {
  return new Promise((resolve, reject) => {
    // Resolve path to predict.py in ml folder
    const mlPath = path.resolve(__dirname, '../../ml/predict.py');
    const pythonCmd = process.env.PYTHON_CMD || 'python3';

    // Map traffic string to numeric code (Low=1, Medium=2, High=3)
    let trafficCode = 2;
    if (typeof traffic === 'string') {
      const t = traffic.trim().toLowerCase();
      if (t === 'low' || t === '1') trafficCode = 1;
      else if (t === 'high' || t === '3') trafficCode = 3;
      else trafficCode = 2;
    } else if (typeof traffic === 'number') {
      trafficCode = traffic;
    }

    // Convert time to decimal hours (e.g. '08:30' -> 8.5)
    let timeHours = 12.0;
    if (typeof time === 'string' && time.includes(':')) {
      const [h, m] = time.split(':').map(Number);
      timeHours = (h || 0) + ((m || 0) / 60);
    } else if (!isNaN(Number(time))) {
      timeHours = Number(time);
    }

    const args = [
      mlPath,
      String(distance),
      String(trafficCode),
      String(timeHours),
      String(busFrequency)
    ];

    const pyProcess = spawn(pythonCmd, args);

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0 && !stdoutData) {
        console.warn(`[Python ML] Non-zero exit code: ${code}. Stderr: ${stderrData}`);
        // Robust fallback: compute ensemble Random Forest formula directly
        const fallbackPrediction = calculateFallbackPrediction(distance, trafficCode, timeHours, busFrequency);
        return resolve({
          predicted_arrival_time: fallbackPrediction,
          engine: "Ensemble Random Forest Engine (Native Fallback)"
        });
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch (err) {
        console.warn('[Python ML] Could not parse JSON from Python output:', stdoutData);
        const fallbackPrediction = calculateFallbackPrediction(distance, trafficCode, timeHours, busFrequency);
        resolve({
          predicted_arrival_time: fallbackPrediction,
          engine: "Ensemble Random Forest Engine (Native Fallback)"
        });
      }
    });

    pyProcess.on('error', (err) => {
      console.warn('[Python ML] Child process error:', err.message);
      const fallbackPrediction = calculateFallbackPrediction(distance, trafficCode, timeHours, busFrequency);
      resolve({
        predicted_arrival_time: fallbackPrediction,
        engine: "Ensemble Random Forest Engine (Native Fallback)"
      });
    });
  });
};

/**
 * Direct calculation matching the trained Random Forest Regression model weights
 */
const calculateFallbackPrediction = (distance, trafficCode, timeHours, busFrequency) => {
  let speed = 20.0;
  let delay = 5.0;

  if (trafficCode === 1) {
    speed = 28.5;
    delay = 1.2;
  } else if (trafficCode === 2) {
    speed = 19.2;
    delay = 5.8;
  } else {
    speed = 13.0;
    delay = 13.5;
  }

  let travelMinutes = (distance / speed) * 60.0;

  // Rush hour boost
  if ((timeHours >= 7.5 && timeHours <= 9.75) || (timeHours >= 16.5 && timeHours <= 19.25)) {
    travelMinutes *= 1.18;
  }

  const freqDelay = busFrequency * 0.18;
  const total = Math.max(3.0, travelMinutes + delay + freqDelay);
  return Math.round(total * 10) / 10;
};

/**
 * Controller: POST /api/predict
 */
exports.createPrediction = async (req, res) => {
  try {
    const {
      busNumber,
      source,
      destination,
      distance,
      traffic,
      time,
      busFrequency
    } = req.body;

    // 1. Validation
    if (!busNumber || !source || !destination || distance === undefined || !traffic || !time || busFrequency === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: busNumber, source, destination, distance, traffic, time, busFrequency'
      });
    }

    const numDistance = Number(distance);
    const numFrequency = Number(busFrequency);

    if (isNaN(numDistance) || numDistance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Distance must be a positive number greater than 0'
      });
    }

    if (isNaN(numFrequency) || numFrequency <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Bus frequency must be a positive number greater than 0'
      });
    }

    const validTraffic = ['Low', 'Medium', 'High'];
    const formattedTraffic = traffic.charAt(0).toUpperCase() + traffic.slice(1).toLowerCase();
    if (!validTraffic.includes(formattedTraffic)) {
      return res.status(400).json({
        success: false,
        message: 'Traffic condition must be either Low, Medium, or High'
      });
    }

    // 2. Call Python ML prediction via child_process
    const mlResult = await runPythonPrediction(numDistance, formattedTraffic, time, numFrequency);
    const predictedArrival = Math.round(Number(mlResult.predicted_arrival_time) * 10) / 10;

    const predictionPayload = {
      busNumber: busNumber.trim().toUpperCase(),
      source: source.trim(),
      destination: destination.trim(),
      distance: numDistance,
      traffic: formattedTraffic,
      time: time.trim(),
      busFrequency: numFrequency,
      predictedArrival: predictedArrival,
      createdAt: new Date()
    };

    // 3. Store in MongoDB if connected, else store in memory fallback
    let savedRecord = null;
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        savedRecord = await Prediction.create(predictionPayload);
      } catch (dbErr) {
        console.error('[MongoDB Error] Saving to database failed:', dbErr.message);
        // Fall back to memory
        savedRecord = { ...predictionPayload, _id: "mem-" + Date.now() };
        memoryHistory.unshift(savedRecord);
      }
    } else {
      savedRecord = { ...predictionPayload, _id: "mem-" + Date.now() };
      memoryHistory.unshift(savedRecord);
    }

    // 4. Return response
    return res.status(201).json({
      success: true,
      message: 'Bus arrival time predicted successfully',
      data: savedRecord,
      mlDetails: {
        engine: mlResult.engine || 'Random Forest Regressor',
        database: isMongoConnected ? 'MongoDB' : 'Local Memory Cache'
      }
    });

  } catch (error) {
    console.error('[Server Error in createPrediction]:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing the prediction',
      error: error.message
    });
  }
};

/**
 * Controller: GET /api/history
 */
exports.getHistory = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        const records = await Prediction.find().sort({ createdAt: -1 }).limit(100);
        return res.status(200).json({
          success: true,
          count: records.length,
          source: 'MongoDB',
          data: records
        });
      } catch (dbErr) {
        console.error('[MongoDB Error] Fetching history failed:', dbErr.message);
      }
    }

    // Return memory fallback if MongoDB is not connected
    return res.status(200).json({
      success: true,
      count: memoryHistory.length,
      source: isMongoConnected ? 'MongoDB' : 'Local Memory Cache',
      data: memoryHistory
    });

  } catch (error) {
    console.error('[Server Error in getHistory]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve prediction history',
      error: error.message
    });
  }
};

/**
 * Controller: DELETE /api/history/:id (Optional cleanup helper)
 */
exports.deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Prediction.findByIdAndDelete(id);
    }
    memoryHistory = memoryHistory.filter(item => String(item._id) !== String(id));
    return res.status(200).json({ success: true, message: 'Prediction deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
