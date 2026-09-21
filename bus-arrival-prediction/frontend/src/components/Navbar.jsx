import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          🚌
        </div>
        <span>BUS ARRIVAL TIME PREDICTOR</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/predict"
            className={`nav-link ${location.pathname === '/predict' ? 'active' : ''}`}
          >
            Predict Arrival
          </Link>
        </li>
        <li>
          <Link
            to="/history"
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            History
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
