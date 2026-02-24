import React, { useState, useRef } from 'react';
import { analyzeContent } from '../services/geminiService';
import { BrainCircuit, Upload, Zap, Lightbulb } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const Analyst: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{base64: string, mimeType: string, preview: string}[]>([]);
  const [result, setResult] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64 = res.split(',')[1];
        setFiles(prev => [...prev, {
            base64,
            mimeType: file.type,
            preview: res
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
        const text = await analyzeContent(prompt, files, isThinking);
        setResult(text);
    } catch (e) {
        console.error(e);
        setResult("Analysis failed.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <LoadingOverlay isVisible={loading} message={isThinking ? "Thinking deeply..." : "Analyzing..."} subMessage={isThinking ? "Allocating 32k token budget for complex reasoning" : "Processing multimodal inputs"} />

      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-serif font-bold">Trend Analyst</h2>
            <p className="text-brand-400 text-sm">Upload images or video frames for deep analysis and strategy.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-brand-900 border border-brand-800 p-1.5 rounded-lg">
            <span className={`text-xs font-medium px-2 ${!isThinking ? 'text-brand-300' : 'text-brand-600'}`}>Fast</span>
            <button 
                onClick={() => setIsThinking(!isThinking)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isThinking ? 'bg-emerald-600' : 'bg-brand-700'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isThinking ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-medium px-2 ${isThinking ? 'text-emerald-400' : 'text-brand-600'}`}>Deep Think</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
         {/* Input Column */}
         <div className="flex flex-col gap-4">
             <div className="flex-1 bg-brand-900 border border-brand-800 rounded-2xl p-6 flex flex-col">
                <div className="flex flex-wrap gap-4 mb-6">
                    {files.map((f, i) => (
                        <div key={i} className="w-24 h-24 relative rounded-lg overflow-hidden border border-brand-700">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={f.preview} alt="upload" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-brand-700 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center text-brand-500 hover:text-emerald-400"
                    >
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] uppercase font-bold">Add Media</span>
                    </button>
                    <input type="file" ref={fileInputRef} multiple className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask the Analyst... (e.g., 'Analyze the color palette trends in these runway photos' or 'What is the emotional tone of this video frame?')"
                    className="w-full flex-1 bg-brand-950 border border-brand-700 rounded-xl p-4 text-brand-100 placeholder-brand-600 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />

                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !prompt}
                    className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        isThinking 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-brand-700 hover:bg-brand-600 text-brand-200'
                    }`}
                >
                    {isThinking ? <BrainCircuit className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    {isThinking ? 'Deep Reason' : 'Quick Analyze'}
                </button>
             </div>
         </div>

         {/* Output Column */}
         <div className="bg-brand-950 border border-brand-800 rounded-2xl p-6 overflow-y-auto relative">
             {result ? (
                 <div className="prose prose-invert max-w-none">
                     <div className="flex items-center gap-2 mb-6 text-emerald-400 border-b border-brand-800 pb-4">
                        <Lightbulb className="w-5 h-5" />
                        <span className="font-serif font-bold text-lg">Analyst Report</span>
                     </div>
                     <div className="whitespace-pre-wrap text-brand-300 leading-relaxed">
                         {result}
                     </div>
                 </div>
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-brand-700 pointer-events-none">
                     <p className="text-xl font-serif opacity-30">Waiting for data...</p>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};