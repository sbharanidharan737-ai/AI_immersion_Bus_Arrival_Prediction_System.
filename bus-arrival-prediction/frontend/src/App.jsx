import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Result from './pages/Result';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            <strong>BUS ARRIVAL TIME PREDICTION SYSTEM</strong> &bull; College Engineering Capstone Project &bull; Machine Learning & MERN Stack
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
