import React, { useState } from 'react';
import axios from 'axios';
import { Send, Sparkles, AlertCircle, Loader2, Navigation, Compass, Activity, Timer } from 'lucide-react';
import { PredictionItem, MLDetails } from '../types';

interface PredictionFormProps {
  onSuccess: (prediction: PredictionItem, mlDetails?: MLDetails) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSuccess }) => {
  const [busNumber, setBusNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [traffic, setTraffic] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [time, setTime] = useState('08:30');
  const [busFrequency, setBusFrequency] = useState('15');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (type: 'morning' | 'noon' | 'evening') => {
    setError(null);
    if (type === 'morning') {
      setBusNumber('21G');
      setSource('Central Terminal');
      setDestination('University Campus');
      setDistance('14.5');
      setTraffic('High');
      setTime('08:45');
      setBusFrequency('10');
    } else if (type === 'noon') {
      setBusNumber('102B');
      setSource('Metro Station East');
      setDestination('Tech Park Sector 4');
      setDistance('9.2');
      setTraffic('Low');
      setTime('12:15');
      setBusFrequency('15');
    } else {
      setBusNumber('55X');
      setSource('Airport Terminal 1');
      setDestination('Downtown City Center');
      setDistance('18.0');
      setTraffic('Medium');
      setTime('17:30');
      setBusFrequency('20');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!busNumber.trim()) {
      setError('Bus Number is required (e.g., 21G, 102B).');
      return;
    }
    if (!source.trim()) {
      setError('Source starting stop is required.');
      return;
    }
    if (!destination.trim()) {
      setError('Destination stop is required.');
      return;
    }

    const distVal = parseFloat(distance);
    if (isNaN(distVal) || distVal <= 0) {
      setError('Distance must be a positive number in kilometers (e.g. 12.5).');
      return;
    }

    if (!time) {
      setError('Current time is required.');
      return;
    }

    const freqVal = parseFloat(busFrequency);
    if (isNaN(freqVal) || freqVal <= 0) {
      setError('Bus frequency must be a positive number in minutes (e.g. 15).');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        busNumber: busNumber.trim().toUpperCase(),
        source: source.trim(),
        destination: destination.trim(),
        distance: distVal,
        traffic,
        time,
        busFrequency: freqVal
      };

      const response = await axios.post('/api/predict', payload);

      if (response.data && response.data.success) {
        onSuccess(response.data.data, response.data.mlDetails);
      } else {
        setError(response.data.message || 'Failed to calculate prediction.');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      const msg = err.response?.data?.message || err.message || 'Error communicating with prediction server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              Machine Learning Model Inference
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Bus Arrival Time Prediction
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Random Forest Model Active</span>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-2 max-w-xl">
          Enter route specifics and environmental metrics to run the regression model and predict transit duration.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Quick Demo Presets */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick College Demo Presets
            </span>
            <span className="text-xs text-slate-500">1-click fill</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              id="preset-morning"
              type="button"
              onClick={() => applyPreset('morning')}
              className="text-left px-3 py-2 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
            >
              <div className="font-semibold text-blue-900">🌅 Morning Peak</div>
              <div className="text-slate-500 text-[11px]">High Traffic &bull; 14.5 km</div>
            </button>
            <button
              id="preset-noon"
              type="button"
              onClick={() => applyPreset('noon')}
              className="text-left px-3 py-2 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
            >
              <div className="font-semibold text-blue-900">☀️ Midday Transit</div>
              <div className="text-slate-500 text-[11px]">Low Traffic &bull; 9.2 km</div>
            </button>
            <button
              id="preset-evening"
              type="button"
              onClick={() => applyPreset('evening')}
              className="text-left px-3 py-2 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
            >
              <div className="font-semibold text-blue-900">🌆 Evening Rush</div>
              <div className="text-slate-500 text-[11px]">Medium Traffic &bull; 18.0 km</div>
            </button>
          </div>
        </div>

        {/* Validation error display */}
        {error && (
          <div
            id="prediction-error-banner"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Validation Notice: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Bus Number */}
            <div>
              <label htmlFor="input-bus-number" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Bus Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-bus-number"
                  type="text"
                  placeholder="e.g. 21G, 102B"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Current Time */}
            <div>
              <label htmlFor="input-current-time" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Current Time (24h) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-current-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                disabled={loading}
              />
            </div>

            {/* Source */}
            <div>
              <label htmlFor="input-source" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Source Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-source"
                  type="text"
                  placeholder="e.g. Central Railway Station"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="input-destination" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Destination Stop <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-destination"
                  type="text"
                  placeholder="e.g. Technology Campus"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Distance */}
            <div>
              <label htmlFor="input-distance" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Distance (in Kilometers) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-distance"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 12.5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                disabled={loading}
              />
            </div>

            {/* Traffic Condition */}
            <div>
              <label htmlFor="input-traffic" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                6. Traffic Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="input-traffic"
                value={traffic}
                onChange={(e) => setTraffic(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                disabled={loading}
              >
                <option value="Low">Low Traffic (Smooth flow - Speed ~28 km/h)</option>
                <option value="Medium">Medium Traffic (Moderate speed ~19 km/h)</option>
                <option value="High">High Traffic (Heavy congestion ~13 km/h)</option>
              </select>
            </div>

            {/* Bus Frequency */}
            <div className="sm:col-span-2">
              <label htmlFor="input-frequency" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                7. Bus Frequency (Headway in minutes) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-frequency"
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 15 (minutes between buses on this route)"
                value={busFrequency}
                onChange={(e) => setBusFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition"
                disabled={loading}
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Average headway between consecutive bus dispatches. Used by the ML model to calculate queue and wait variability.
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              id="submit-predict-button"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Random Forest Prediction...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Predict Bus Arrival Time</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
