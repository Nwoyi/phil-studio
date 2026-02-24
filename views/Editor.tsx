import React, { useState, useRef } from 'react';
import { editImageWithFlash, optimizePrompt } from '../services/geminiService';
import { Upload, ArrowRight, Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const Editor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMimeType, setSourceMimeType] = useState<string>('image/jpeg');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSourceImage(base64);
      setEditedImage(null); // Reset result
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;

    setLoading(true);
    try {
        // Extract base64 raw data from Data URL
        const base64Data = sourceImage.split(',')[1];
        const result = await editImageWithFlash(base64Data, prompt, sourceMimeType);
        setEditedImage(result);
    } catch (e) {
        console.error(e);
        alert("Editing failed. See console.");
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

  return (
    <div className="h-full flex flex-col gap-6">
      <LoadingOverlay isVisible={loading} message="Applying Magic Edit..." subMessage="Using Gemini 2.5 Flash Image" />
      
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-serif font-bold">Magic Editor</h2>
            <p className="text-brand-400 text-sm">Upload an asset and use natural language to retouch or modify it.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left: Source */}
        <div className="flex flex-col gap-4">
            <div 
                className={`flex-1 bg-brand-900/30 border-2 border-dashed ${sourceImage ? 'border-brand-700' : 'border-brand-600 hover:border-indigo-500'} rounded-2xl flex flex-col items-center justify-center relative transition-colors`}
                onClick={() => !sourceImage && fileInputRef.current?.click()}
            >
                {sourceImage ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sourceImage} alt="Source" className="max-w-full max-h-full object-contain p-4" />
                        <button 
                            onClick={() => { setSourceImage(null); setEditedImage(null); }}
                            className="absolute top-4 right-4 bg-brand-950/80 text-brand-200 px-3 py-1 rounded-full text-xs backdrop-blur hover:bg-red-900/80 transition-colors"
                        >
                            Clear
                        </button>
                    </>
                ) : (
                    <div className="text-center p-8 cursor-pointer">
                        <div className="w-16 h-16 bg-brand-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-brand-400" />
                        </div>
                        <p className="font-medium text-brand-300">Upload Source Asset</p>
                        <p className="text-xs text-brand-500 mt-2">JPG, PNG supported</p>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload} 
                />
            </div>
            
            <div className="bg-brand-900 border border-brand-800 p-4 rounded-xl flex gap-3">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'Add a retro filter', 'Remove the background person'..."
                    className="flex-1 bg-transparent border-none outline-none text-brand-100 placeholder-brand-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                
                <button 
                    onClick={handleOptimize}
                    disabled={optimizing || !prompt}
                    className="flex items-center justify-center px-3 py-2 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors disabled:opacity-50"
                    title="Optimize Prompt"
                >
                     {optimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>

                <button 
                    onClick={handleEdit}
                    disabled={!sourceImage || !prompt || loading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-brand-800 text-white p-2 rounded-lg transition-colors"
                >
                    <Wand2 className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Right: Result */}
        <div className="flex flex-col gap-4">
            <div className="flex-1 bg-brand-900/30 border border-brand-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                 {editedImage ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain p-4" />
                 ) : (
                     <div className="text-center text-brand-700">
                        <ArrowRight className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Edited result will appear here</p>
                     </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};