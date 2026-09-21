import React from 'react';
import { Bus, MapPin, Gauge, Clock, Calendar, CheckCircle2, RotateCcw, ListFilter, Database, Cpu } from 'lucide-react';
import { PredictionItem, MLDetails } from '../types';

interface PredictionCardProps {
  prediction: PredictionItem | null;
  mlDetails?: MLDetails;
  onNewPrediction: () => void;
  onViewHistory: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  mlDetails,
  onNewPrediction,
  onViewHistory
}) => {
  if (!prediction) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl">
        <Bus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Prediction Selected</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Please run a prediction from the prediction page to view results.
        </p>
        <button
          onClick={onNewPrediction}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer"
        >
          Go to Prediction Form
        </button>
      </div>
    );
  }

  const {
    busNumber,
    source,
    destination,
    distance,
    traffic,
    time,
    busFrequency,
    predictedArrival,
    createdAt
  } = prediction;

  // Calculate ETA clock time (e.g. 08:30 + 28 mins = 08:58)
  const calculateETA = () => {
    if (!time || !time.includes(':')) return null;
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + Math.round(predictedArrival);
    const arrH = Math.floor(totalMinutes / 60) % 24;
    const arrM = totalMinutes % 60;
    return `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;
  };

  const etaClock = calculateETA();

  const getTrafficBadge = (t: string) => {
    const val = String(t).toLowerCase();
    if (val === 'low') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Low Traffic
        </span>
      );
    }
    if (val === 'high') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          High Traffic
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        Medium Traffic
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Banner with Highlighted ETA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 text-center relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/40 text-blue-100 text-xs font-medium tracking-wide uppercase mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>ML Regression Output</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-2">
            <span id="result-arrival-minutes" className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              {predictedArrival}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-blue-100">
              Minutes
            </span>
          </div>
          <p className="text-sm text-blue-100/90 mt-1 font-medium">
            Predicted Transit Arrival Duration
          </p>

          {etaClock && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold">
              <Clock className="w-4 h-4 text-blue-200" />
              <span>Projected Arrival Clock: <strong className="text-white text-base">{etaClock}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Trip & Environmental Attributes Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Trip Specifications & Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Bus & Traffic */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Bus Number</span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-blue-600" />
                  {busNumber}
                </span>
                {getTrafficBadge(traffic)}
              </div>
            </div>

            {/* Distance */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Trip Distance</span>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>{distance} km</span>
              </div>
            </div>

            {/* Route */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Route Corridor</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 flex-wrap">
                <div className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{source}</span>
                </div>
                <span className="text-slate-400">→</span>
                <div className="flex items-center gap-1 text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{destination}</span>
                </div>
              </div>
            </div>

            {/* Time & Frequency */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Current Time</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{time} (24h)</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Bus Frequency (Headway)</span>
              <div className="text-sm font-semibold text-slate-900">
                Every {busFrequency} minutes
              </div>
            </div>
          </div>
        </div>

        {/* Backend & ML Telemetry Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Inference Algorithm:
            </span>
            <span className="font-semibold text-slate-800">
              {mlDetails?.engine || 'Random Forest Regressor (100 Trees)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              Persistence Target:
            </span>
            <span className="font-semibold text-slate-800">
              {mlDetails?.database || 'MongoDB (Mongoose)'}
            </span>
          </div>

          {createdAt && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-400">
              <span>Timestamp:</span>
              <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="new-prediction-btn"
            onClick={onNewPrediction}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Make Another Prediction</span>
          </button>

          <button
            id="view-history-btn"
            onClick={onViewHistory}
            className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ListFilter className="w-4 h-4 text-slate-500" />
            <span>View All History Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
