export interface PredictionItem {
  _id?: string;
  busNumber: string;
  source: string;
  destination: string;
  distance: number;
  traffic: 'Low' | 'Medium' | 'High' | string;
  time: string;
  busFrequency: number;
  predictedArrival: number;
  createdAt?: string | Date;
}

export interface MLDetails {
  engine: string;
  database: string;
}

export interface ModelMetrics {
  algorithm: string;
  n_estimators: number;
  mae: number;
  r2_score: number;
  samples_count: number;
  features?: string[];
  target?: string;
}
