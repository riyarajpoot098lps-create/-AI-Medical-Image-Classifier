
import React from 'react';
import type { HistoryItem } from '../types';
import { Clock, Trash2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  currentPredictionId?: string | null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, currentPredictionId }) => {
  const getFeedbackIcon = (feedback: HistoryItem['feedback']) => {
    switch(feedback) {
      case 'correct': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'incorrect': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <HelpCircle className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Prediction History</h3>
        <button
          onClick={onClear}
          disabled={history.length === 0}
          className="p-2 rounded-md hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Clear history"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {history.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">No predictions yet. Upload an image to begin.</p>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${currentPredictionId === item.id ? 'bg-brand-primary/30' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
            >
              <img src={item.imageSrc} alt="Scan thumbnail" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{item.prediction.predictions[0].class}</p>
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex-shrink-0" title={`Feedback: ${item.feedback}`}>
                {getFeedbackIcon(item.feedback)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
