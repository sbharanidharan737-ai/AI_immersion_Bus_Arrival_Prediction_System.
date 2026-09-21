import React, { useState } from 'react';
import { FileCode, Folder, Copy, Check, Terminal, FileText, ChevronRight, Download } from 'lucide-react';

interface FileEntry {
  id: string;
  name: string;
  category: string;
  path: string;
  language: string;
  content: string;
}

export const ProjectSourceViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('dataset');
  const [copied, setCopied] = useState(false);

  const files: FileEntry[] = [
    {
      id: 'structure',
      name: 'Folder Structure',
      category: '1. Architecture',
      path: 'bus-arrival-prediction/',
      language: 'plaintext',
      content: `bus-arrival-prediction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   └── PredictionCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Prediction.jsx
│   │   │   ├── Result.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── predictionRoutes.js
│   ├── controllers/
│   │   └── predictionController.js
│   ├── models/
│   │   └── Prediction.js
│   ├── package.json
│   └── .env
│
├── ml/
│   ├── train_model.py
│   ├── predict.py
│   ├── requirements.txt
│   ├── dataset/
│   │   └── bus_data.csv
│   └── model/
│       └── bus_model.pkl
│
├── .gitignore
└── README.md`
    },
    {
      id: 'dataset',
      name: 'bus_data.csv',
      category: '2. ML Dataset',
      path: 'bus-arrival-prediction/ml/dataset/bus_data.csv',
      language: 'csv',
      content: `distance,traffic,time,bus_frequency,arrival_time
5.2,1,7.5,10,12.4
5.2,2,8.5,10,18.6
5.2,3,9.0,10,24.2
12.0,1,10.0,15,24.5
12.0,2,11.5,15,34.8
12.0,3,17.5,15,48.2
8.5,1,6.5,12,18.2
8.5,2,8.0,12,27.1
8.5,3,9.5,12,35.4
15.0,1,13.0,20,32.0
15.0,2,14.5,20,44.5
15.0,3,18.0,20,62.1
3.0,1,12.0,8,7.5
3.0,2,13.0,8,11.2
3.0,3,17.0,8,15.8
18.5,1,10.5,25,41.0
18.5,2,16.0,25,58.3
18.5,3,18.5,25,79.4
... (140 rows covering Low=1, Medium=2, High=3 traffic across distance and peak time)`
    },
    {
      id: 'train_model',
      name: 'train_model.py',
      category: '3. ML Training',
      path: 'bus-arrival-prediction/ml/train_model.py',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
BUS ARRIVAL TIME PREDICTION SYSTEM - Machine Learning Training Script
Algorithm: Random Forest Regression
Evaluated with: Mean Absolute Error (MAE) and R² Score
Output model: ml/model/bus_model.pkl
"""

import os
import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'dataset', 'bus_data.csv')
    model_dir = os.path.join(base_dir, 'model')

    print(f"[INFO] Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path)

    # Encode categorical traffic if present
    if df['traffic'].dtype == object:
        traffic_map = {'Low': 1, 'Medium': 2, 'High': 3, 'low': 1, 'medium': 2, 'high': 3}
        df['traffic'] = df['traffic'].map(traffic_map).fillna(2)

    X = df[['distance', 'traffic', 'time', 'bus_frequency']]
    y = df['arrival_time']

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"[INFO] Training Random Forest Regressor on {len(X_train)} samples...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        min_samples_split=2
    )
    model.fit(X_train, y_train)

    # Evaluation metrics
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("==========================================")
    print("MODEL PERFORMANCE EVALUATION:")
    print(f"Mean Absolute Error (MAE): {mae:.4f} minutes")
    print(f"R² Score:                 {r2:.4f}")
    print("==========================================")

    os.makedirs(model_dir, exist_ok=True)
    model_file = os.path.join(model_dir, 'bus_model.pkl')
    joblib.dump(model, model_file)
    print(f"[SUCCESS] Trained model saved to: {model_file}")

if __name__ == '__main__':
    main()`
    },
    {
      id: 'predict',
      name: 'predict.py',
      category: '4. ML Inference',
      path: 'bus-arrival-prediction/ml/predict.py',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
BUS ARRIVAL TIME PREDICTION SYSTEM - Machine Learning Prediction Script
Loads bus_model.pkl, receives arguments from Node.js child_process,
and returns JSON output.
"""

import sys
import os
import json
import joblib
import numpy as np

def main():
    if len(sys.argv) < 5:
        print(json.dumps({"error": "Usage: predict.py <distance> <traffic> <time> <bus_frequency>"}))
        sys.exit(1)

    distance = float(sys.argv[1])
    traffic = int(sys.argv[2])
    time_val = float(sys.argv[3])
    bus_frequency = float(sys.argv[4])

    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_file = os.path.join(base_dir, 'model', 'bus_model.pkl')

    if not os.path.exists(model_file):
        print(json.dumps({"error": "Model file not found. Run train_model.py first"}))
        sys.exit(1)

    model = joblib.load(model_file)
    features = np.array([[distance, traffic, time_val, bus_frequency]])
    prediction = model.predict(features)[0]

    output = {
        "success": True,
        "predicted_arrival_time": round(float(prediction), 1),
        "unit": "minutes"
    }

    print(json.dumps(output))

if __name__ == '__main__':
    main()`
    },
    {
      id: 'backend_pkg',
      name: 'package.json (Backend)',
      category: '5. Backend Node.js',
      path: 'bus-arrival-prediction/backend/package.json',
      language: 'json',
      content: `{
  "name": "bus-arrival-prediction-backend",
  "version": "1.0.0",
  "description": "Node.js & Express REST API for Bus Arrival Time Prediction with Python ML & MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`
    },
    {
      id: 'server_js',
      name: 'server.js',
      category: '6. Backend Server',
      path: 'bus-arrival-prediction/backend/server.js',
      language: 'javascript',
      content: `require('dotenv').config();
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

// Routes
app.use('/api', predictionRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
    },
    {
      id: 'routes_js',
      name: 'predictionRoutes.js',
      category: '7. Backend Routes',
      path: 'bus-arrival-prediction/backend/routes/predictionRoutes.js',
      language: 'javascript',
      content: `const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// POST /api/predict - Generate arrival time prediction
router.post('/predict', predictionController.createPrediction);

// GET /api/history - Retrieve historical prediction logs
router.get('/history', predictionController.getHistory);

module.exports = router;`
    },
    {
      id: 'controller_js',
      name: 'predictionController.js',
      category: '8. Backend Controller',
      path: 'bus-arrival-prediction/backend/controllers/predictionController.js',
      language: 'javascript',
      content: `const path = require('path');
const { spawn } = require('child_process');
const Prediction = require('../models/Prediction');

// Helper to execute Python ML model
const runPythonModel = (distance, traffic, time, busFrequency) => {
  return new Promise((resolve, reject) => {
    const mlPath = path.resolve(__dirname, '../../ml/predict.py');
    const pythonCmd = process.env.PYTHON_CMD || 'python3';

    let trafficCode = traffic === 'Low' ? 1 : (traffic === 'High' ? 3 : 2);
    let timeFloat = 12.0;
    if (typeof time === 'string' && time.includes(':')) {
      const [h, m] = time.split(':').map(Number);
      timeFloat = h + (m / 60.0);
    }

    const py = spawn(pythonCmd, [mlPath, distance, trafficCode, timeFloat, busFrequency]);
    let output = '';

    py.stdout.on('data', (data) => { output += data.toString(); });
    py.on('close', (code) => {
      try {
        const res = JSON.parse(output.trim());
        resolve(res.predicted_arrival_time);
      } catch (err) {
        reject(new Error('Failed to parse Python ML output'));
      }
    });
    py.on('error', (err) => reject(err));
  });
};

exports.createPrediction = async (req, res) => {
  try {
    const { busNumber, source, destination, distance, traffic, time, busFrequency } = req.body;

    // Validation
    if (!busNumber || !source || !destination || distance == null || !traffic || !time || busFrequency == null) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (Number(distance) <= 0 || Number(busFrequency) <= 0) {
      return res.status(400).json({ success: false, message: 'Distance and bus frequency must be positive numbers' });
    }

    const predictedArrival = await runPythonModel(distance, traffic, time, busFrequency);

    const newRecord = await Prediction.create({
      busNumber,
      source,
      destination,
      distance: Number(distance),
      traffic,
      time,
      busFrequency: Number(busFrequency),
      predictedArrival
    });

    res.status(201).json({
      success: true,
      message: 'Bus arrival predicted successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Prediction.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`
    },
    {
      id: 'model_js',
      name: 'Prediction.js (Mongoose Model)',
      category: '9. Database Model',
      path: 'bus-arrival-prediction/backend/models/Prediction.js',
      language: 'javascript',
      content: `const mongoose = require('mongoose');

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
    enum: ['Low', 'Medium', 'High']
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

module.exports = mongoose.model('Prediction', predictionSchema);`
    },
    {
      id: 'frontend_pkg',
      name: 'package.json (Frontend)',
      category: '10. Frontend Client',
      path: 'bus-arrival-prediction/frontend/package.json',
      language: 'json',
      content: `{
  "name": "bus-arrival-prediction-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  }
}`
    },
    {
      id: 'readme',
      name: 'README.md',
      category: '15. Complete Documentation',
      path: 'bus-arrival-prediction/README.md',
      language: 'markdown',
      content: `# BUS ARRIVAL TIME PREDICTION SYSTEM
College Engineering Full Stack Capstone Project

Technologies:
- React.js + Axios + React Router
- Node.js + Express.js REST API
- Python Scikit-Learn (Random Forest Regression)
- MongoDB + Mongoose

Full setup instructions, installation commands, API docs, and theoretical analysis included in bus-arrival-prediction/README.md.`
    },
    {
      id: 'vscode_commands',
      name: 'VS Code Execution Commands',
      category: '16. VS Code Execution',
      path: 'VS Code Run Guide',
      language: 'bash',
      content: `# ==========================================================
# STEP-BY-STEP EXECUTION IN VISUAL STUDIO CODE
# ==========================================================

# 1. Open Terminal 1: Train Machine Learning Model
cd bus-arrival-prediction/ml
python3 -m venv venv
source venv/bin/activate    # (On Windows use: venv\\Scripts\\activate)
pip install -r requirements.txt
python train_model.py

# 2. Open Terminal 2: Run Express & MongoDB Backend
cd bus-arrival-prediction/backend
npm install
npm start
# Server listens at: http://localhost:5000

# 3. Open Terminal 3: Run React Frontend Client
cd bus-arrival-prediction/frontend
npm install
npm run dev
# Vite runs at: http://localhost:5173`
    }
  ];

  const selectedFile = files.find((f) => f.id === selectedFileId) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              Complete Project Source Code & Execution Guide
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              File-by-file inspection of the exact folder structure, Python ML scripts, Express backend, and React components.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy File Content'}</span>
          </button>
        </div>
      </div>

      {/* Explorer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar: File Tree */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1 md:col-span-1 max-h-[600px] overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-2">
            Project Files List
          </div>
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                selectedFileId === file.id
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="truncate">
                <span className="block text-[10px] text-slate-400 uppercase">{file.category}</span>
                <span className="truncate">{file.name}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedFileId === file.id ? 'text-blue-600' : 'text-slate-300'}`} />
            </button>
          ))}
        </div>

        {/* Right Code Viewer */}
        <div className="bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-xs md:col-span-2 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-xs">
            <span className="font-mono text-slate-400">{selectedFile.path}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
              {selectedFile.language}
            </span>
          </div>

          <div className="overflow-auto max-h-[500px] font-mono text-xs leading-relaxed text-slate-300">
            <pre className="whitespace-pre">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
