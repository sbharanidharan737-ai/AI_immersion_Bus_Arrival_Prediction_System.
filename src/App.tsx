import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Prediction } from './pages/Prediction';
import { Result } from './pages/Result';
import { History } from './pages/History';
import { ProjectSourceViewer } from './components/ProjectSourceViewer';
import { PredictionItem, MLDetails, ModelMetrics } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'predict' | 'result' | 'history' | 'code'>('home');
  const [currentPrediction, setCurrentPrediction] = useState<PredictionItem | null>(null);
  const [currentMLDetails, setCurrentMLDetails] = useState<MLDetails | undefined>(undefined);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    // Load model metrics from backend
    axios.get('/api/metrics')
      .then((res) => {
        if (res.data) setMetrics(res.data);
      })
      .catch((err) => {
        console.warn('Metrics endpoint warning:', err.message);
      });
  }, []);

  const handlePredictionSuccess = (pred: PredictionItem, details?: MLDetails) => {
    setCurrentPrediction(pred);
    setCurrentMLDetails(details);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <Home
            onStartPredict={() => setActiveTab('predict')}
            onViewHistory={() => setActiveTab('history')}
            onViewCode={() => setActiveTab('code')}
            metrics={metrics}
          />
        )}

        {activeTab === 'predict' && (
          <Prediction onPredictionSuccess={handlePredictionSuccess} />
        )}

        {activeTab === 'result' && (
          <Result
            prediction={currentPrediction}
            mlDetails={currentMLDetails}
            onNewPrediction={() => setActiveTab('predict')}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <History onNewPrediction={() => setActiveTab('predict')} />
        )}

        {activeTab === 'code' && (
          <ProjectSourceViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>BUS ARRIVAL TIME PREDICTION SYSTEM</strong> &bull; College Engineering Capstone Project
          </span>
          <span>
            Stack: React.js &bull; Node.js Express &bull; Python Scikit-Learn (Random Forest) &bull; MongoDB
          </span>
        </div>
      </footer>
    </div>
  );
}
