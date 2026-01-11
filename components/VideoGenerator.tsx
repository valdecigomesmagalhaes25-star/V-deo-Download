
import React, { useState, useRef } from 'react';
import { VideoConfig } from '../types';

interface VideoGeneratorProps {
  onGenerate: (config: VideoConfig) => void;
  isGenerating: boolean;
  progressMessage: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate, isGenerating, progressMessage }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      prompt,
      aspectRatio,
      resolution,
      image: imageBase64 || undefined
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {isGenerating && (
        <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
             <i className="fa-solid fa-wand-magic-sparkles absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 text-xl animate-pulse"></i>
          </div>
          <h3 className="text-xl font-bold mt-8 mb-2">Creating Cinematic Content</h3>
          <p className="text-indigo-400 font-medium h-6">{progressMessage}</p>
          <p className="text-gray-500 text-sm mt-4 max-w-xs">High-quality video synthesis usually takes between 1-3 minutes. Please stay with us.</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="fa-solid fa-clapperboard text-indigo-500"></i>
        Studio Console
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Video Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the cinematic masterpiece you imagine..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-white placeholder-gray-600"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Reference Image (Optional First Frame)</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden"
              disabled={isGenerating}
            >
              {imageBase64 ? (
                <img src={imageBase64} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <i className="fa-solid fa-image text-gray-600"></i>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Upload</span>
                </>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {imageBase64 && (
              <button 
                type="button"
                onClick={() => setImageBase64(null)}
                className="text-red-400 text-xs hover:text-red-300 underline"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-all ${
                  aspectRatio === '16:9' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
                disabled={isGenerating}
              >
                16:9 Landscape
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-all ${
                  aspectRatio === '9:16' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
                disabled={isGenerating}
              >
                9:16 Portrait
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Resolution</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setResolution('720p')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-all ${
                  resolution === '720p' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
                disabled={isGenerating}
              >
                720p
              </button>
              <button
                type="button"
                onClick={() => setResolution('1080p')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-all ${
                  resolution === '1080p' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
                disabled={isGenerating}
              >
                1080p
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-sparkles"></i>
          Generate Video
        </button>
      </form>
    </div>
  );
};

export default VideoGenerator;
