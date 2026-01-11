
import React, { useState, useEffect, useCallback } from 'react';
import { GeneratedVideo, GenerationStatus, VideoConfig } from './types';
import { generateAIVideo } from './services/geminiService';
import Navbar from './components/Navbar';
import VideoGenerator from './components/VideoGenerator';
import VideoHistory from './components/VideoHistory';
import ApiKeyOverlay from './components/ApiKeyOverlay';

const STORAGE_KEY = 'vividmotion_history';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for non-studio environments if necessary
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const saveToHistory = useCallback((video: GeneratedVideo) => {
    setHistory(prev => {
      const updated = [video, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleGenerate = async (config: VideoConfig) => {
    setIsGenerating(true);
    setProgressMessage("Starting generation...");
    
    try {
      const videoUrl = await generateAIVideo(config, (msg) => {
        setProgressMessage(msg);
      });

      const newVideo: GeneratedVideo = {
        id: crypto.randomUUID(),
        url: videoUrl,
        prompt: config.prompt,
        timestamp: Date.now(),
        aspectRatio: config.aspectRatio,
        resolution: config.resolution
      };

      saveToHistory(newVideo);
      setIsGenerating(false);
    } catch (error: any) {
      console.error(error);
      if (error.message === "API_KEY_RESET") {
        setHasApiKey(false);
      } else {
        alert("Generation failed: " + error.message);
      }
      setIsGenerating(false);
    }
  };

  const handleApiKeySuccess = () => {
    setHasApiKey(true);
  };

  const deleteVideo = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <VideoGenerator 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              progressMessage={progressMessage}
            />
          </div>
          
          <div className="lg:col-span-7">
            <VideoHistory 
              history={history} 
              onDelete={deleteVideo}
            />
          </div>
        </div>
      </main>

      {hasApiKey === false && (
        <ApiKeyOverlay onKeySelected={handleApiKeySuccess} />
      )}

      <footer className="py-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2024 VividMotion AI Studio. Powered by Google Veo & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
