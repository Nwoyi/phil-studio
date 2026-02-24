import React from 'react';
import { Camera, Clapperboard, BrainCircuit, ArrowRight, Wand2, Layers, Zap } from 'lucide-react';

export const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-brand-950 text-white overflow-y-auto">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <span className="font-serif font-bold text-lg">P</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Phil Fash</span>
        </div>
        <button 
          onClick={onEnter}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium text-sm transition-all"
        >
          Enter Studio
        </button>
      </nav>

      {/* Hero */}
      <header className="px-6 py-20 lg:py-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 animate-fade-in">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-6">
            Gemini 3 Pro + Veo Powered
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent leading-tight">
            The Intelligent Future <br/> of Fashion Production
          </h1>
          <p className="text-xl text-brand-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Phil Fash AI Studio replaces the expensive traditional production cycle with a single, powerful generative interface. Create campaigns, not logistical nightmares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onEnter}
              className="px-8 py-4 bg-white text-brand-950 font-bold rounded-full text-lg hover:bg-brand-100 transition-all flex items-center justify-center gap-2 group"
            >
              Try it out <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-brand-900/50 border-y border-brand-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">Complete Creative Suite</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Virtual Photography</h3>
              <p className="text-brand-400 leading-relaxed">
                Generate 4K studio-quality catalog assets using Gemini 3 Pro. Control lighting, fabric, and composition with natural language.
              </p>
            </div>

            <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-pink-500/50 transition-colors group">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clapperboard className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Veo Video Runway</h3>
              <p className="text-brand-400 leading-relaxed">
                Create cinematic fashion films. Turn static images into moving runway shots or generate video from scratch with Veo 3.1.
              </p>
            </div>

            <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trend Intelligence</h3>
              <p className="text-brand-400 leading-relaxed">
                Upload mood boards or runway photos. Our "Deep Thinking" model analyzes color palettes, fabrics, and emotional tones.
              </p>
            </div>

             <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-purple-400/50 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Magic Editor</h3>
              <p className="text-brand-400 leading-relaxed">
                Retouch and reimagine assets instantly. "Change the background to Paris" or "Remove the bag" with simple commands.
              </p>
            </div>

             <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-blue-400/50 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
              <p className="text-brand-400 leading-relaxed">
                Scale your output. Generate assets for an entire 50-piece collection in minutes by uploading a simple text list.
              </p>
            </div>

             <div className="bg-brand-950 border border-brand-800 p-8 rounded-2xl hover:border-orange-400/50 transition-colors group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Upscaling</h3>
              <p className="text-brand-400 leading-relaxed">
                Start fast with 1K drafts, then upscale your winning shots to 4K resolution for final print or web deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-brand-500 text-sm">
        <p>© 2025 Phil Fash AI Studio. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};