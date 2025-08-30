
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploadPanel } from './components/ImageUploadPanel';
import { PredictionView } from './components/PredictionView';
import { HistoryPanel } from './components/HistoryPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { InfoPanel } from './components/InfoPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateClassification } from './services/geminiService';
import type { HistoryItem, PredictionResult, Feedback } from './types';
import { FileRejection } from 'react-dropzone';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'dark');
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('predictionHistory', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleImageUpload = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setError(`File validation failed. Please upload images only (e.g., JPEG, PNG).`);
      return;
    }
    if (acceptedFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    setCurrentPrediction(null);

    const file = acceptedFiles[0]; // For this version, we process one image at a time from a potential batch
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = (reader.result as string).split(',')[1];
        const result: PredictionResult = await generateClassification(base64Image);
        
        const newHistoryItem: HistoryItem = {
          id: `pred_${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageSrc: reader.result as string,
          prediction: result,
          feedback: 'none',
        };
        
        setHistory(prev => [newHistoryItem, ...prev]);
        setCurrentPrediction(newHistoryItem);
      } catch (e) {
        console.error(e);
        setError('Failed to get prediction from AI. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
      setIsLoading(false);
    };
  }, [setHistory]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentPrediction(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    
  const handleFeedback = (id: string, feedback: Feedback) => {
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, feedback } : item
    );
    setHistory(updatedHistory);
    if(currentPrediction && currentPrediction.id === id) {
      setCurrentPrediction({...currentPrediction, feedback});
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentPrediction(null);
  };

  return (
    <div className={`min-h-screen ${theme} bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans`}>
      <div className="bg-gradient-to-br from-teal-400/20 via-indigo-400/20 to-rose-400/20 dark:from-teal-600/20 dark:via-indigo-600/20 dark:to-rose-600/20 backdrop-blur-lg">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ImageUploadPanel onDrop={handleImageUpload} isLoading={isLoading} />
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {currentPrediction ? (
                <PredictionView item={currentPrediction} onFeedback={handleFeedback} />
              ) : (
                !isLoading && <InfoPanel />
              )}
            </div>
            <div className="space-y-8">
              <HistoryPanel history={history} onSelect={handleSelectHistoryItem} onClear={clearHistory} currentPredictionId={currentPrediction?.id} />
              <MetricsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
