
import React from 'react';
import { GeneratedVideo } from '../types';

interface VideoHistoryProps {
  history: GeneratedVideo[];
  onDelete: (id: string) => void;
}

const VideoHistory: React.FC<VideoHistoryProps> = ({ history, onDelete }) => {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-layer-group text-indigo-500"></i>
          Production History
        </h2>
        <span className="text-sm text-gray-500">{history.length} Creations</span>
      </div>

      {history.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-film text-3xl text-gray-600"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-400">No videos yet</h3>
          <p className="text-sm text-gray-600 max-w-xs mt-1">Start generating your first cinematic sequence using the console on the left.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((video) => (
            <div key={video.id} className="glass-card rounded-2xl overflow-hidden group hover:ring-2 hover:ring-indigo-500/50 transition-all duration-300">
              <div className={`relative ${video.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
                <video 
                  src={video.url} 
                  controls 
                  className="w-full h-full object-contain"
                  preload="metadata"
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDownload(video.url, `vividmotion-${video.id}.mp4`)}
                    className="w-9 h-9 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
                    title="Download Video"
                  >
                    <i className="fa-solid fa-download"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(video.id)}
                    className="w-9 h-9 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                    title="Delete Video"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">{video.resolution}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">{video.aspectRatio}</span>
                  <span className="ml-auto text-[10px] text-gray-500">{new Date(video.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed italic">
                  &ldquo;{video.prompt}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoHistory;
