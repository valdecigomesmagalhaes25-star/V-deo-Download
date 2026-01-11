
export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export type GenerationStatus = 'idle' | 'initializing' | 'generating' | 'fetching' | 'completed' | 'error';

export interface GenerationProgress {
  status: GenerationStatus;
  message: string;
}

export interface VideoConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  image?: string; // base64
}
