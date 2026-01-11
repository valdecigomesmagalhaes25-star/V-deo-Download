
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-play text-white text-xs"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Vivid<span className="gradient-text">Motion</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
          <div className="h-8 w-px bg-white/10"></div>
          <button className="text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/5 transition-all">
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
