import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw, Bus, Database, AlertCircle, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { PredictionItem } from '../types';

interface HistoryProps {
  onNewPrediction: () => void;
}

export const History: React.FC<HistoryProps> = ({ onNewPrediction }) => {
  const [records, setRecords] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [databaseSource, setDatabaseSource] = useState('MongoDB');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/history');
      if (res.data && res.data.success) {
        setRecords(res.data.data || []);
        setDatabaseSource(res.data.source || 'MongoDB');
      } else {
        setError('Failed to load history records.');
      }
    } catch (err: any) {
      console.error('History fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Error fetching prediction records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getTrafficBadge = (t: string) => {
    const val = String(t).toLowerCase();
    if (val === 'low') {
      return (
        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Low
        </span>
      );
    }
    if (val === 'high') {
      return (
        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
          High
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        Medium
      </span>
    );
  };

  const filteredRecords = records.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.busNumber.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      String(item.traffic).toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Prediction History
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {records.length} records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Storage Source: <strong>{databaseSource}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-history-input"
                type="text"
                placeholder="Search bus, route, traffic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 outline-hidden transition"
              />
            </div>

            <button
              id="refresh-history-btn"
              onClick={fetchHistory}
              disabled={loading}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onNewPrediction}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              + New Predict
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Retrieving prediction documents from database...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Bus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {search ? 'No Matching Records' : 'No Prediction History Yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
            {search
              ? 'Try modifying your search query to find previous bus arrival forecasts.'
              : 'Execute your first bus arrival prediction using the Random Forest model.'}
          </p>
          <button
            onClick={onNewPrediction}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start First Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Bus No.</th>
                  <th className="py-3 px-4">Corridor Route</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Traffic</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4 text-right">Predicted Duration</th>
                  <th className="py-3 px-4 text-right">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      🚌 {item.busNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <span>{item.source}</span>
                        <span className="text-slate-400 font-normal">→</span>
                        <span>{item.destination}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {item.distance} km
                    </td>
                    <td className="py-3.5 px-4">
                      {getTrafficBadge(item.traffic)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.busFrequency} min
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg border border-blue-200/60 font-mono text-sm">
                        {item.predictedArrival} min
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-400 whitespace-nowrap">
                      {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
