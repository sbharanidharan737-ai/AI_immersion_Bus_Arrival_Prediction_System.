import React from 'react';
import { PredictionCard } from '../components/PredictionCard';
import { PredictionItem, MLDetails } from '../types';

interface ResultProps {
  prediction: PredictionItem | null;
  mlDetails?: MLDetails;
  onNewPrediction: () => void;
  onViewHistory: () => void;
}

export const Result: React.FC<ResultProps> = ({
  prediction,
  mlDetails,
  onNewPrediction,
  onViewHistory
}) => {
  return (
    <div className="py-2">
      <PredictionCard
        prediction={prediction}
        mlDetails={mlDetails}
        onNewPrediction={onNewPrediction}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};
