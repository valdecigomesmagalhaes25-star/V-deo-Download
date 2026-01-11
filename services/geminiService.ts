
import { GoogleGenAI } from "@google/genai";
import { VideoConfig } from "../types";

const MAX_POLLING_ATTEMPTS = 60; // 10 minutes at 10s intervals
const POLLING_INTERVAL = 10000;

const PROGRESS_MESSAGES = [
  "Initializing neural engines...",
  "Analyzing visual descriptors...",
  "Synthesizing motion dynamics...",
  "Refining spatial consistency...",
  "Rendering cinematic textures...",
  "Color grading the sequences...",
  "Polishing final frames...",
  "Wrapping up high-fidelity pixels..."
];

export const generateAIVideo = async (
  config: VideoConfig,
  onProgress: (msg: string) => void
): Promise<string> => {
  // Always create a new instance to ensure latest API key from studio dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let messageIndex = 0;
    const updateProgress = () => {
      onProgress(PROGRESS_MESSAGES[messageIndex % PROGRESS_MESSAGES.length]);
      messageIndex++;
    };

    updateProgress();

    const request: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: config.prompt,
      config: {
        numberOfVideos: 1,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio
      }
    };

    if (config.image) {
      request.image = {
        imageBytes: config.image.split(',')[1],
        mimeType: 'image/png'
      };
    }

    let operation = await ai.models.generateVideos(request);

    let attempts = 0;
    while (!operation.done && attempts < MAX_POLLING_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
      updateProgress();
      
      try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
      } catch (e: any) {
        if (e.message?.includes("Requested entity was not found")) {
          throw new Error("API_KEY_RESET");
        }
        throw e;
      }
    }

    if (!operation.done) {
      throw new Error("Generation timed out. Please try again.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Could not retrieve video link.");
    }

    // Fetch the MP4 bytes using the API key
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};
