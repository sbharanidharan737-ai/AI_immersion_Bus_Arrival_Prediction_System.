import React from 'react';
import { PredictionForm } from '../components/PredictionForm';
import { PredictionItem, MLDetails } from '../types';

interface PredictionProps {
  onPredictionSuccess: (prediction: PredictionItem, mlDetails?: MLDetails) => void;
}

export const Prediction: React.FC<PredictionProps> = ({ onPredictionSuccess }) => {
  return (
    <div className="py-2">
      <PredictionForm onSuccess={onPredictionSuccess} />
    </div>
  );
};
