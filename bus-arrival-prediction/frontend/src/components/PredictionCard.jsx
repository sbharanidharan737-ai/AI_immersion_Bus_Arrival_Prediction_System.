import React from 'react';
import { Link } from 'react-router-dom';

const PredictionCard = ({ prediction, mlDetails }) => {
  if (!prediction) {
    return (
      <div className="result-card-wrapper" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3>No Prediction Data Found</h3>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
          Please fill out the form to generate a bus arrival time prediction.
        </p>
        <Link to="/predict" className="cta-button">
          Go to Prediction Form
        </Link>
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

  // Calculate clock arrival time (e.g. 08:30 + 28 mins => 08:58)
  const calculateETA = () => {
    if (!time || !time.includes(':')) return null;
    const [h, m] = time.split(':').map(Number);
    const totalMins = (h * 60 + m) + Math.round(predictedArrival);
    const arrivalH = Math.floor(totalMins / 60) % 24;
    const arrivalM = totalMins % 60;
    const formattedH = String(arrivalH).padStart(2, '0');
    const formattedM = String(arrivalM).padStart(2, '0');
    return `${formattedH}:${formattedM}`;
  };

  const etaClock = calculateETA();

  const getTrafficClass = (val) => {
    const t = String(val).toLowerCase();
    if (t === 'low') return 'traffic-badge traffic-low';
    if (t === 'high') return 'traffic-badge traffic-high';
    return 'traffic-badge traffic-medium';
  };

  return (
    <div className="result-card-wrapper">
      <div className="result-card">
        {/* Top Highlight Banner */}
        <div className="result-header">
          <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Predicted Bus Transit Duration
          </span>
          <div className="result-metric-box">
            <span className="result-metric-number">{predictedArrival}</span>
            <span className="result-metric-unit">Minutes</span>
            <div className="result-metric-label">
              Estimated Arrival Time ({predictedArrival} min approx.)
            </div>
            {etaClock && (
              <div style={{ marginTop: '0.6rem', fontSize: '1.15rem', fontWeight: 600, background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '20px' }}>
                Expected Arrival Clock: <strong>{etaClock}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Attribute Breakdown */}
        <div className="result-body">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Bus Number</div>
              <div className="info-value">🚌 {busNumber}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Traffic Condition</div>
              <div className="info-value">
                <span className={getTrafficClass(traffic)}>{traffic}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Source Origin</div>
              <div className="info-value">{source}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Destination</div>
              <div className="info-value">{destination}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Trip Distance</div>
              <div className="info-value">{distance} km</div>
            </div>

            <div className="info-item">
              <div className="info-label">Departure / Current Time</div>
              <div className="info-value">{time}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Bus Frequency</div>
              <div className="info-value">Every {busFrequency} mins</div>
            </div>

            <div className="info-item">
              <div className="info-label">ML Algorithm</div>
              <div className="info-value" style={{ fontSize: '0.95rem' }}>
                Random Forest Regressor
              </div>
            </div>
          </div>

          {mlDetails && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#475569' }}>
              <div><strong>⚙️ Execution Engine:</strong> {mlDetails.engine || 'Random Forest Regressor'}</div>
              <div><strong>🗄️ Storage:</strong> {mlDetails.database || 'MongoDB'}</div>
              {createdAt && (
                <div style={{ marginTop: '0.2rem', color: '#64748b' }}>
                  <strong>🕒 Timestamp:</strong> {new Date(createdAt).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/predict" className="cta-button" style={{ flex: 1, justifyContent: 'center' }}>
              🔄 New Prediction
            </Link>
            <Link
              to="/history"
              className="cta-button"
              style={{
                flex: 1,
                justifyContent: 'center',
                background: '#fff',
                color: '#2563eb',
                border: '2px solid #2563eb',
                boxShadow: 'none'
              }}
            >
              📋 View History Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
