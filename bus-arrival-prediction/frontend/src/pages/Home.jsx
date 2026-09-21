import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Header Section */}
      <section className="hero-section">
        <span className="badge-tag">College Engineering Capstone Project</span>
        <h1 className="hero-title">
          BUS ARRIVAL TIME PREDICTION SYSTEM
        </h1>
        <p className="hero-subtitle">
          An end-to-end intelligent transit analytics platform leveraging Random Forest Regression,
          real-time traffic categorization, and route parameters to forecast accurate bus arrival times.
        </p>

        <div>
          <Link to="/predict" className="cta-button">
            <span>⚡ Predict Bus Arrival</span>
          </Link>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🌲</div>
          <h3 className="feature-title">Random Forest Regression</h3>
          <p className="feature-desc">
            Ensemble learning technique utilizing multiple decision trees to mitigate overfitting and
            accurately model non-linear traffic and transit delays.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚦</div>
          <h3 className="feature-title">Multi-Feature Ingestion</h3>
          <p className="feature-desc">
            Takes route distance, peak-hour time slots, traffic density (Low, Medium, High), and bus dispatch
            headway to compute accurate predictions.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🗄️</div>
          <h3 className="feature-title">MongoDB & Node.js Stack</h3>
          <p className="feature-desc">
            Full-stack integration linking React, Express RESTful endpoints, Python ML child-process
            execution, and MongoDB historical persistence.
          </p>
        </div>
      </div>

      {/* System Flow Diagram */}
      <div style={{ marginTop: '3.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
          Application Data Flow
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          How input parameters traverse from client interface to ML inference and database storage
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ background: '#eff6ff', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '1.5rem' }}>💻</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem' }}>1. React Form</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>User Inputs Parameters</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem' }}>📡</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem' }}>2. Axios POST</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Express REST API</div>
          </div>

          <div style={{ background: '#eff6ff', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '1.5rem' }}>🐍</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem' }}>3. Python Process</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Random Forest Model</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem' }}>🗄️</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem' }}>4. MongoDB</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Store Record History</div>
          </div>

          <div style={{ background: '#eff6ff', padding: '1rem 0.5rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '1.5rem' }}>⏱️</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.3rem' }}>5. Result Display</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Minutes & ETA Clock</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
