
import React from 'react';
import { Zap, Eye, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-brand-primary" />,
    title: 'Instant AI Analysis',
    description: 'Get multi-class predictions with confidence scores in seconds.',
  },
  {
    icon: <Eye className="h-8 w-8 text-brand-secondary" />,
    title: 'Explainable Results',
    description: 'Visualize the AI\'s focus with Grad-CAM heatmaps for better understanding.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-rose-500" />,
    title: 'Track & Review',
    description: 'Maintain a persistent history of your analyses and provide feedback.',
  },
];

export const InfoPanel: React.FC = () => {
  return (
    <div className="p-6 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <h2 className="text-2xl font-bold text-center mb-2">Welcome to the AI Medical Classifier</h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-6">Upload a medical scan to begin your analysis.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {features.map((feature, index) => (
          <div key={index} className="p-4 bg-slate-200/40 dark:bg-slate-700/40 rounded-lg">
            <div className="flex justify-center mb-3">{feature.icon}</div>
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
