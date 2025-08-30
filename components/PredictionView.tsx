
import React, { useState } from 'react';
import type { HistoryItem, Prediction, Feedback } from '../types';
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

const GradCamViewer: React.FC<{ imageSrc: string, gradCam: HistoryItem['prediction']['gradCam'] }> = ({ imageSrc, gradCam }) => {
  const [opacity, setOpacity] = useState(0.6);
  const { top, left, width, height } = gradCam.focusArea;

  const heatmapStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    height: `${height}%`,
    background: `radial-gradient(circle, rgba(255,0,0,${opacity}) 0%, rgba(255,255,0,${opacity*0.75}) 50%, rgba(0,255,255,0) 100%)`,
    borderRadius: '50%',
    pointerEvents: 'none',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Explainable AI (Grad-CAM)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <img src={imageSrc} alt="Original medical scan" className="rounded-lg w-full shadow-md" />
           <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</div>
        </div>
        <div className="relative">
          <img src={imageSrc} alt="Medical scan with Grad-CAM overlay" className="rounded-lg w-full shadow-md" />
          <div style={heatmapStyle}></div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Grad-CAM Overlay</div>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="opacity-slider" className="block text-sm font-medium">Heatmap Opacity: {Math.round(opacity * 100)}%</label>
        <input
          id="opacity-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div>
        <h4 className="font-semibold">AI Focus Explanation:</h4>
        <p className="text-slate-600 dark:text-slate-400 italic">"{gradCam.explanation}"</p>
      </div>
    </div>
  );
};

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  const color = percentage > 85 ? 'bg-teal-500' : percentage > 60 ? 'bg-amber-500' : 'bg-rose-500';
  
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export const PredictionView: React.FC<{ item: HistoryItem; onFeedback: (id: string, feedback: Feedback) => void; }> = ({ item, onFeedback }) => {
  const topPrediction = item.prediction.predictions[0];

  return (
    <div className="space-y-6 p-6 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <div>
        <h2 className="text-2xl font-bold mb-4">Prediction Summary</h2>
        <div className="space-y-4">
          {item.prediction.predictions.map((p: Prediction, index: number) => (
            <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-brand-primary/20 border border-brand-primary' : 'bg-slate-200/50 dark:bg-slate-700/50'}`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold text-lg ${index === 0 ? 'text-brand-primary dark:text-teal-300' : ''}`}>{index + 1}. {p.class}</span>
                <span className={`font-semibold text-lg ${index === 0 ? 'text-brand-primary dark:text-teal-300' : ''}`}>{Math.round(p.confidence * 100)}%</span>
              </div>
              <ConfidenceMeter confidence={p.confidence} />
            </div>
          ))}
        </div>
      </div>
      
      <GradCamViewer imageSrc={item.imageSrc} gradCam={item.prediction.gradCam} />

      <div className="border-t border-slate-300/50 dark:border-slate-600/50 pt-4 space-y-2">
        <h4 className="font-semibold text-center">Was this prediction helpful?</h4>
        <div className="flex justify-center items-center space-x-4">
          <button onClick={() => onFeedback(item.id, 'correct')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${item.feedback === 'correct' ? 'bg-green-500/80 text-white' : 'bg-green-500/20 hover:bg-green-500/40'}`}>
            <ThumbsUp className="h-5 w-5" />
            <span>Correct</span>
          </button>
          <button onClick={() => onFeedback(item.id, 'incorrect')} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${item.feedback === 'incorrect' ? 'bg-red-500/80 text-white' : 'bg-red-500/20 hover:bg-red-500/40'}`}>
            <ThumbsDown className="h-5 w-5" />
            <span>Incorrect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
