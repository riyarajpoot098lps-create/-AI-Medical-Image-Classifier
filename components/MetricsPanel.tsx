
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Info } from 'lucide-react';

const performanceData = [
  { name: 'Accuracy', value: 0.96, fill: '#14b8a6' },
  { name: 'Precision', value: 0.94, fill: '#6366f1' },
  { name: 'Recall', value: 0.95, fill: '#f43f5e' },
  { name: 'F1-Score', value: 0.94, fill: '#f59e0b' },
];

const classDistributionData = [
    { name: 'Normal', value: 4500 },
    { name: 'Pneumonia', value: 3200 },
    { name: 'Cardiomegaly', value: 1500 },
    { name: 'Other', value: 800 },
];

const COLORS = ['#14b8a6', '#6366f1', '#f43f5e', '#f59e0b'];

export const MetricsPanel: React.FC = () => {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
      <h3 className="text-xl font-bold mb-4">Model Performance</h3>
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-start space-x-2">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          These metrics represent the model's performance on our validation dataset. Model Version: ResNet50-v1.2
        </span>
      </div>

      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis type="number" domain={[0.8, 1]} tickFormatter={(tick) => `${tick * 100}%`} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip
              formatter={(value: number) => (value * 100).toFixed(2) + '%'}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

       <h4 className="text-lg font-semibold mb-2 text-center">Training Class Distribution</h4>
       <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={classDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {classDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} images`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
