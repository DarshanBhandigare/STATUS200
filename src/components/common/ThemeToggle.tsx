import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
      } ${className}`}
    >
      {/* Track */}
      <span
        className={`relative flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
          isDark ? 'bg-emerald-500' : 'bg-slate-200'
        }`}
      >
        {/* Thumb */}
        <span
          className={`absolute inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            isDark ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
      {/* Icon */}
      <span className="text-[13px] font-medium flex items-center gap-1">
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-300">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline text-slate-600">Light</span>
          </>
        )}
      </span>
    </button>
  );
};
