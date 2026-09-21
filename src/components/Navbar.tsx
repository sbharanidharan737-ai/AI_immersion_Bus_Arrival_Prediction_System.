import React from 'react';
import { Bus, Clock, History as HistoryIcon, Home as HomeIcon, Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'predict' | 'result' | 'history' | 'code';
  setActiveTab: (tab: 'home' | 'predict' | 'result' | 'history' | 'code') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          id="nav-brand-button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-900 tracking-tight leading-tight">
              BUS ARRIVAL TIME
            </span>
            <span className="block text-xs font-semibold text-blue-600 tracking-wider uppercase">
              Prediction System
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-home"
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'home'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            id="nav-tab-predict"
            onClick={() => setActiveTab('predict')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'predict'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Predict</span>
          </button>

          <button
            id="nav-tab-history"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            id="nav-tab-code"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'code'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden md:inline">Project Files</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
