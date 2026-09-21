import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const PredictionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    busNumber: '',
    source: '',
    destination: '',
    distance: '',
    traffic: 'Medium',
    time: '08:30',
    busFrequency: '15'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick preset loader for college demonstration
  const handleLoadPreset = (preset) => {
    setError('');
    if (preset === 'morning') {
      setFormData({
        busNumber: '21G',
        source: 'Central Terminal',
        destination: 'University Campus',
        distance: '14.5',
        traffic: 'High',
        time: '08:45',
        busFrequency: '10'
      });
    } else if (preset === 'midday') {
      setFormData({
        busNumber: '102B',
        source: 'Metro Junction',
        destination: 'Tech Park Zone 2',
        distance: '9.2',
        traffic: 'Low',
        time: '12:15',
        busFrequency: '15'
      });
    } else {
      setFormData({
        busNumber: '55X',
        source: 'Airport Blvd',
        destination: 'City Center Mall',
        distance: '18.0',
        traffic: 'Medium',
        time: '17:30',
        busFrequency: '20'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!formData.busNumber.trim()) {
      setError('Please enter a valid Bus Number (e.g. 21G, 102B).');
      return;
    }
    if (!formData.source.trim()) {
      setError('Please enter a Source starting point.');
      return;
    }
    if (!formData.destination.trim()) {
      setError('Please enter a Destination location.');
      return;
    }
    const distNum = parseFloat(formData.distance);
    if (isNaN(distNum) || distNum <= 0) {
      setError('Distance must be a positive number greater than 0 km.');
      return;
    }
    if (!formData.time) {
      setError('Please select or enter the current time.');
      return;
    }
    const freqNum = parseFloat(formData.busFrequency);
    if (isNaN(freqNum) || freqNum <= 0) {
      setError('Bus frequency must be a positive number greater than 0 minutes.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        busNumber: formData.busNumber.trim().toUpperCase(),
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        distance: distNum,
        traffic: formData.traffic,
        time: formData.time,
        busFrequency: freqNum
      };

      const response = await axios.post(`${API_BASE}/predict`, payload);

      if (response.data && response.data.success) {
        // Navigate to result page and pass the prediction response
        navigate('/result', {
          state: {
            prediction: response.data.data,
            mlDetails: response.data.mlDetails
          }
        });
      } else {
        setError(response.data.message || 'Failed to generate arrival prediction.');
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Could not connect to backend prediction server.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="card-header">
        <h2 className="card-title">Predict Bus Arrival Time</h2>
        <p className="card-subtitle">
          Enter trip specifics and let our Random Forest ML model forecast the transit duration.
        </p>
      </div>

      <div className="preset-bar">
        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Quick Demo Presets:</span>
        <button type="button" className="preset-chip" onClick={() => handleLoadPreset('morning')}>
          🌅 Morning Peak (High Traffic)
        </button>
        <button type="button" className="preset-chip" onClick={() => handleLoadPreset('midday')}>
          ☀️ Midday Transit (Low Traffic)
        </button>
        <button type="button" className="preset-chip" onClick={() => handleLoadPreset('evening')}>
          🌆 Evening Commute (Medium Traffic)
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Bus Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="busNumber">Bus Number *</label>
            <input
              id="busNumber"
              type="text"
              name="busNumber"
              className="form-control"
              placeholder="e.g. 21G, 102B"
              value={formData.busNumber}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Current Time */}
          <div className="form-group">
            <label className="form-label" htmlFor="time">Current Time *</label>
            <input
              id="time"
              type="time"
              name="time"
              className="form-control"
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Source */}
          <div className="form-group">
            <label className="form-label" htmlFor="source">Source Location *</label>
            <input
              id="source"
              type="text"
              name="source"
              className="form-control"
              placeholder="e.g. Central Railway Station"
              value={formData.source}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Destination */}
          <div className="form-group">
            <label className="form-label" htmlFor="destination">Destination *</label>
            <input
              id="destination"
              type="text"
              name="destination"
              className="form-control"
              placeholder="e.g. Technology Campus"
              value={formData.destination}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Distance */}
          <div className="form-group">
            <label className="form-label" htmlFor="distance">Distance (in Kilometers) *</label>
            <input
              id="distance"
              type="number"
              step="0.1"
              min="0.1"
              name="distance"
              className="form-control"
              placeholder="e.g. 12.5"
              value={formData.distance}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Traffic Condition */}
          <div className="form-group">
            <label className="form-label" htmlFor="traffic">Traffic Condition *</label>
            <select
              id="traffic"
              name="traffic"
              className="form-control"
              value={formData.traffic}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="Low">Low Traffic (Fluid flow)</option>
              <option value="Medium">Medium Traffic (Moderate speed)</option>
              <option value="High">High Traffic (Congested peak)</option>
            </select>
          </div>

          {/* Bus Frequency */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="busFrequency">Bus Frequency (Headway in minutes) *</label>
            <input
              id="busFrequency"
              type="number"
              step="1"
              min="1"
              name="busFrequency"
              className="form-control"
              placeholder="e.g. 15 (minutes between buses)"
              value={formData.busFrequency}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              How frequently buses depart from the origin station on this transit line.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span>⏳</span>
                <span>Calculating Arrival with Random Forest Model...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Predict Arrival Time</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
