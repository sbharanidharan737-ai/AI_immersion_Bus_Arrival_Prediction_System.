import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceDb, setSourceDb] = useState('MongoDB');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE}/history`);
      if (res.data && res.data.success) {
        setHistory(res.data.data || []);
        setSourceDb(res.data.source || 'MongoDB');
      } else {
        setError('Failed to fetch prediction history records.');
      }
    } catch (err) {
      console.error('Fetch history error:', err);
      setError(err.response?.data?.message || err.message || 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getTrafficBadge = (traffic) => {
    const t = String(traffic).toLowerCase();
    if (t === 'low') return <span className="traffic-badge traffic-low">Low</span>;
    if (t === 'high') return <span className="traffic-badge traffic-high">High</span>;
    return <span className="traffic-badge traffic-medium">Medium</span>;
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.busNumber?.toLowerCase().includes(q) ||
      item.source?.toLowerCase().includes(q) ||
      item.destination?.toLowerCase().includes(q) ||
      item.traffic?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Prediction History</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Historical bus arrival records retrieved from <strong>{sourceDb}</strong> database
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-control"
              style={{ width: '220px', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              placeholder="Search bus, route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={fetchHistory}
              className="cta-button"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', boxShadow: 'none' }}
              title="Refresh database records"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>Loading prediction records from MongoDB...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚌</div>
            <h4 style={{ fontWeight: 600, color: '#1e293b' }}>No Prediction Records Found</h4>
            <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '0.95rem' }}>
              {searchQuery ? 'No records matched your search query.' : 'No bus arrival predictions have been saved yet.'}
            </p>
            <Link to="/predict" className="cta-button" style={{ fontSize: '0.95rem' }}>
              Generate First Prediction
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Bus No.</th>
                  <th>Route (Source → Destination)</th>
                  <th>Distance</th>
                  <th>Traffic</th>
                  <th>Time</th>
                  <th>Frequency</th>
                  <th>Predicted Arrival</th>
                  <th>Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>
                      <strong style={{ color: '#2563eb' }}>{item.busNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{item.source}</strong>
                        <span style={{ margin: '0 0.35rem', color: '#94a3b8' }}>→</span>
                        <strong>{item.destination}</strong>
                      </div>
                    </td>
                    <td>{item.distance} km</td>
                    <td>{getTrafficBadge(item.traffic)}</td>
                    <td>{item.time}</td>
                    <td>{item.busFrequency} min</td>
                    <td>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.predictedArrival} mins
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
