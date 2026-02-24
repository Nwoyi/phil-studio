import React, { useState } from 'react';
import { generateImagePro, upscaleImagePro, optimizePrompt } from '../services/geminiService';
import { Download, RefreshCw, Wand2, Camera, Sparkles, Maximize2 } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const StudioImage: React.FC = () => {
  const [prompt, setPrompt] = useState("A high fashion studio shot of a model wearing a futuristic silver trench coat, dramatic lighting, 8k resolution");
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [upscaling, setUpscaling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateImagePro(prompt, size);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt) return;
    setOptimizing(true);
    try {
      const betterPrompt = await optimizePrompt(prompt, 'image');
      setPrompt(betterPrompt);
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setOptimizing(false);
    }
  };

  const handleUpscale = async () => {
    if (!prompt) return;
    setUpscaling(true);
    try {
        const result = await upscaleImagePro(prompt);
        setGeneratedImage(result);
        setSize('4K'); // Update UI to reflect high res
    } catch (e: any) {
        setError("Upscaling failed: " + e.message);
    } finally {
        setUpscaling(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <LoadingOverlay 
        isVisible={loading || upscaling} 
        message={upscaling ? "Upscaling to 4K..." : "Developing Catalog Asset..."} 
        subMessage={upscaling ? "Enhancing resolution and details with Gemini 3 Pro" : `Using Gemini 3 Pro Image (${size})`} 
      />

      {/* Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Catalog Generation</h2>
          <p className="text-brand-400 text-sm">Create high-resolution studio assets without a physical shoot.</p>
        </div>

        <div className="bg-brand-900 border border-brand-800 p-6 rounded-2xl space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-brand-300">Art Direction Prompt</label>
                <button 
                    onClick={handleOptimize}
                    disabled={optimizing || !prompt}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md"
                >
                    {optimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {optimizing ? "Enhancing..." : "Optimize"}
                </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-brand-950 border border-brand-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[120px]"
              placeholder="Describe the model, clothing, lighting, and environment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-300 mb-3">Output Resolution</label>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                    size === s
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'border-brand-700 text-brand-500 hover:border-brand-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-5 h-5" />
            Generate Asset
          </button>
        </div>
        
        {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-xl text-sm">
                {error}
            </div>
        )}
      </div>

      {/* Preview */}
      <div className="flex-1 bg-brand-900/50 border border-brand-800 rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[400px]">
        {generatedImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={generatedImage} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-2xl" />
            
            <div className="absolute top-6 right-6 flex gap-2">
                 {size !== '4K' && (
                    <button 
                        onClick={handleUpscale}
                        disabled={upscaling}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur text-white rounded-lg transition-colors font-medium text-sm shadow-lg"
                        title="Upscale to 4K"
                    >
                        <Maximize2 className="w-4 h-4" />
                        Upscale to 4K
                    </button>
                )}
                <a href={generatedImage} download="phil-fash-asset.png" className="p-2 bg-black/50 backdrop-blur text-white rounded-lg hover:bg-black/70 transition-colors">
                    <Download className="w-5 h-5" />
                </a>
            </div>
            
            <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs text-white/80 border border-white/10">
                {size} Resolution
            </div>
          </div>
        ) : (
          <div className="text-center text-brand-600">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Ready to shoot</p>
          </div>
        )}
      </div>
    </div>
  );
};