
import React from 'react';

interface ApiKeyOverlayProps {
  onKeySelected: () => void;
}

const ApiKeyOverlay: React.FC<ApiKeyOverlayProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      onKeySelected();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-xl">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center shadow-2xl border-white/20">
        <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-key text-3xl text-indigo-500"></i>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Enterprise Access Required</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          High-fidelity video generation via Google Veo requires a specialized API key from a paid Google Cloud Project.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-xl"
          >
            Connect Paid API Key
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-sm text-indigo-400 hover:text-indigo-300 underline"
          >
            Learn about API Billing & Documentation
          </a>
        </div>
        
        <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest font-medium">
          Secure Sandbox Environment
        </p>
      </div>
    </div>
  );
};

export default ApiKeyOverlay;
