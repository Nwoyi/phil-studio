export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  STUDIO_IMAGE = 'STUDIO_IMAGE',
  STUDIO_VIDEO = 'STUDIO_VIDEO',
  BATCH_STUDIO = 'BATCH_STUDIO',
  EDITOR = 'EDITOR',
  ANALYST = 'ANALYST',
  VOICE = 'VOICE',
  GUIDE = 'GUIDE'
}

export enum GeminiModel {
  // Image Generation
  IMAGE_PRO = 'gemini-3-pro-image-preview',
  
  // Image Editing
  IMAGE_FLASH = 'gemini-2.5-flash-image',
  
  // Video Generation
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO_PRO = 'veo-3.1-generate-preview', // Required for extension
  
  // Intelligence / Analysis / Text
  PRO_PREVIEW = 'gemini-3-pro-preview',
  TEXT_FAST = 'gemini-3-flash-preview',
  
  // Speech / Audio
  TTS = 'gemini-2.5-flash-preview-tts',
  AUDIO = 'gemini-3-flash-preview'
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  prompt: string;
  createdAt: Date;
}

// Helper for window.aistudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}