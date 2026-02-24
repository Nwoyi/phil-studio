import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { GeminiModel } from "../types";

// Helper to get a fresh client instance. 
// We create a new instance per call to ensure we pick up the latest API Key if changed via window.aistudio
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImagePro = async (
  prompt: string, 
  size: '1K' | '2K' | '4K'
): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: GeminiModel.IMAGE_PRO,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "3:4", // Fashion catalog standard
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned");
};

// Re-generates the image with 4K resolution using the same prompt
export const upscaleImagePro = async (
    prompt: string
): Promise<string> => {
    return generateImagePro(prompt, '4K');
};

export const editImageWithFlash = async (
  base64Image: string,
  prompt: string,
  mimeType: string
): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: GeminiModel.IMAGE_FLASH,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image data returned");
};

// Return type updated to include metadata for extension
export const generateVeoVideo = async (
  prompt: string,
  aspectRatio: '16:9' | '9:16',
  imageInput?: { base64: string, mimeType: string }
): Promise<{ url: string, videoResource: any }> => {
  const ai = getAiClient();

  let requestConfig: any = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: aspectRatio
  };

  let requestParams: any = {
    model: GeminiModel.VEO_FAST,
    config: requestConfig
  };

  if (imageInput) {
    // Image-to-Video
    requestParams.image = {
      imageBytes: imageInput.base64,
      mimeType: imageInput.mimeType
    };
    if (prompt) requestParams.prompt = prompt;
  } else {
    // Text-to-Video
    requestParams.prompt = prompt;
  }

  let operation = await ai.models.generateVideos(requestParams);

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message || 'Unknown API error'}`);
  }

  const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
  const downloadLink = generatedVideo?.uri;
  
  if (!downloadLink) throw new Error("Video generation completed but returned no URI.");

  // Fetch with API Key
  const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoRes.blob();
  
  return {
    url: URL.createObjectURL(blob),
    videoResource: generatedVideo // Return the full resource for extension
  };
};

export const extendVeoVideo = async (
  prompt: string,
  previousVideoResource: any,
  aspectRatio: '16:9' | '9:16'
): Promise<{ url: string, videoResource: any }> => {
  const ai = getAiClient();

  // Extension requires the standard model, not fast
  // And requires the previous video resource object
  let operation = await ai.models.generateVideos({
    model: GeminiModel.VEO_PRO,
    prompt: prompt || "Continue the scene",
    video: previousVideoResource,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video extension failed: ${operation.error.message || 'Unknown API error'}`);
  }

  const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
  const downloadLink = generatedVideo?.uri;

  if (!downloadLink) throw new Error("Video extension completed but returned no URI.");

  const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoRes.blob();

  return {
    url: URL.createObjectURL(blob),
    videoResource: generatedVideo
  };
};

export const optimizePrompt = async (rawIdea: string, type: 'image' | 'video'): Promise<string> => {
  const ai = getAiClient();
  const context = type === 'image' 
    ? "High-end fashion photography, 8k, detailed textures, professional lighting"
    : "Cinematic film shot, 4k, fluid motion, professional color grading";

  const response = await ai.models.generateContent({
    model: GeminiModel.TEXT_FAST,
    contents: `You are an expert prompt engineer for generative AI. 
    Rewrite the following raw idea into a detailed, professional prompt optimized for ${type} generation. 
    Keep it under 60 words. Focus on visual details, lighting, and style.
    Context: ${context}
    
    Raw Idea: "${rawIdea}"
    
    Optimized Prompt:`,
  });

  return response.text?.trim() || rawIdea;
};

export const analyzeContent = async (
  prompt: string,
  fileParts: { base64: string, mimeType: string }[],
  isThinkingMode: boolean
): Promise<string> => {
  const ai = getAiClient();
  
  const contents = [
    ...fileParts.map(f => ({
      inlineData: {
        data: f.base64,
        mimeType: f.mimeType
      }
    })),
    { text: prompt }
  ];

  let config: any = {};
  
  if (isThinkingMode) {
    config.thinkingConfig = { thinkingBudget: 32768 };
    // DO NOT set maxOutputTokens when using thinking budget as per guidelines
  }

  const response = await ai.models.generateContent({
    model: GeminiModel.PRO_PREVIEW,
    contents: { parts: contents as any },
    config
  });

  return response.text || "No analysis generated.";
};


// Audio Decoding Helper
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: GeminiModel.TTS,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, professional voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");

  const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 24000});
  
  return await decodeAudioData(
    decode(base64Audio),
    outputAudioContext,
    24000,
    1,
  );
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: GeminiModel.AUDIO,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Audio,
            mimeType: mimeType
          }
        },
        { text: "Transcribe this audio exactly as spoken. Do not add any other commentary." }
      ]
    }
  });

  return response.text?.trim() || "";
};