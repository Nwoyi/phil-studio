import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Mic2, Play, Pause, Loader2 } from 'lucide-react';

export const Voice: React.FC = () => {
  const [text, setText] = useState("The Spring 2025 collection redefines elegance with sustainable materials and bold geometric cuts.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const handleGenerateAndPlay = async () => {
    setLoading(true);
    try {
      const buffer = await generateSpeech(text);
      setAudioBuffer(buffer);
      playBuffer(buffer);
    } catch (e) {
      console.error(e);
      alert("TTS failed");
    } finally {
      setLoading(false);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsPlaying(false);
    source.start();
    setIsPlaying(true);
  };

  const handleReplay = () => {
      if(audioBuffer) playBuffer(audioBuffer);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-2">Voice Studio</h2>
            <p className="text-brand-400">Generate professional voiceovers for your campaigns.</p>
        </div>

        <div className="bg-brand-900 border border-brand-800 rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
                <label className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-2 block">Script</label>
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 bg-brand-950 border border-brand-700 rounded-xl p-4 text-brand-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg leading-relaxed resize-none"
                    placeholder="Enter script text..."
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleGenerateAndPlay}
                    disabled={loading || !text}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic2 className="w-6 h-6" />}
                    {loading ? "Synthesizing..." : "Generate & Speak"}
                </button>

                {audioBuffer && !loading && (
                    <button 
                        onClick={handleReplay}
                        disabled={isPlaying}
                        className="w-20 bg-brand-800 hover:bg-brand-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                    >
                       {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                )}
            </div>
            
            <div className="mt-4 text-center">
                <span className="text-xs text-brand-600 bg-brand-950 px-3 py-1 rounded-full border border-brand-800">Model: Gemini 2.5 Flash TTS • Voice: Fenrir</span>
            </div>
        </div>
    </div>
  );
};