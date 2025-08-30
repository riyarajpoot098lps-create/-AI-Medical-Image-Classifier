
import React from 'react';
import { BrainCircuit, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="container mx-auto flex items-center justify-between p-4 md:p-6 border-b border-slate-300/20">
      <div className="flex items-center space-x-3">
        <BrainCircuit className="h-8 w-8 text-brand-primary" />
        <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
          AI Medical Image Classifier
        </h1>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </button>
    </header>
  );
};
