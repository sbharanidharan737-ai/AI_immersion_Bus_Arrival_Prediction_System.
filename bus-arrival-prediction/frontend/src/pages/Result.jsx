import React from 'react';
import { useLocation } from 'react-router-dom';
import PredictionCard from '../components/PredictionCard';

const Result = () => {
  const location = useLocation();
  const prediction = location.state?.prediction;
  const mlDetails = location.state?.mlDetails;

  return (
    <div className="result-page">
      <PredictionCard prediction={prediction} mlDetails={mlDetails} />
    </div>
  );
};

export default Result;
