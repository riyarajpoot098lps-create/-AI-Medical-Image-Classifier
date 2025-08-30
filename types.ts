
export interface Prediction {
  class: string;
  confidence: number;
}

export interface GradCam {
  explanation: string;
  focusArea: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface PredictionResult {
  predictions: Prediction[];
  gradCam: GradCam;
}

export type Feedback = 'correct' | 'incorrect' | 'none';

export interface HistoryItem {
  id: string;
  timestamp: string;
  imageSrc: string;
  prediction: PredictionResult;
  feedback: Feedback;
}
