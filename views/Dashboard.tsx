import React from 'react';
import { AppView } from '../types';
import { ArrowRight, Sparkles, Camera, Clapperboard, BrainCircuit, Layers } from 'lucide-react';

export const Dashboard: React.FC<{ onViewChange: (view: AppView) => void }> = ({ onViewChange }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          The future of fashion production.
        </h1>
        <p className="text-xl text-brand-400 max-w-2xl leading-relaxed">
          Welcome to Phil Fash AI Studio. We've replaced the $40K production cycle with a single intelligent interface. Generate models, create films, and analyze trends instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Catalog */}
        <div 
          onClick={() => onViewChange(AppView.STUDIO_IMAGE)}
          className="group relative overflow-hidden rounded-2xl bg-brand-900 border border-brand-800 p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <Camera className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Virtual Catalog</h3>
            <p className="text-sm text-brand-400 mb-4">Generate high-fidelity fashion photography with Gemini 3 Pro.</p>
            <span className="inline-flex items-center text-xs text-indigo-400 font-medium group-hover:gap-2 transition-all">
              Start Shoot <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>

        {/* Card 2: Batch */}
        <div 
          onClick={() => onViewChange(AppView.BATCH_STUDIO)}
          className="group relative overflow-hidden rounded-2xl bg-brand-900 border border-brand-800 p-6 hover:border-blue-500/50 transition-all cursor-pointer"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Batch Production</h3>
            <p className="text-sm text-brand-400 mb-4">Scale your workflow. Generate assets for entire collections at once.</p>
            <span className="inline-flex items-center text-xs text-blue-400 font-medium group-hover:gap-2 transition-all">
              Open Batch <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>

        {/* Card 3: Video */}
        <div 
          onClick={() => onViewChange(AppView.STUDIO_VIDEO)}
          className="group relative overflow-hidden rounded-2xl bg-brand-900 border border-brand-800 p-6 hover:border-pink-500/50 transition-all cursor-pointer"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
              <Clapperboard className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Veo Runway</h3>
            <p className="text-sm text-brand-400 mb-4">Create cinematic campaign videos from text or existing images.</p>
            <span className="inline-flex items-center text-xs text-pink-400 font-medium group-hover:gap-2 transition-all">
              Create Video <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>

        {/* Card 4: Analyst */}
        <div 
          onClick={() => onViewChange(AppView.ANALYST)}
          className="group relative overflow-hidden rounded-2xl bg-brand-900 border border-brand-800 p-6 hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Deep Intelligence</h3>
            <p className="text-sm text-brand-400 mb-4">Complex reasoning and multimodal analysis using Gemini 3 Pro.</p>
            <span className="inline-flex items-center text-xs text-emerald-400 font-medium group-hover:gap-2 transition-all">
              Analyze Trends <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-brand-900/50 border border-brand-800 rounded-xl">
        <h4 className="text-sm font-semibold text-brand-400 uppercase tracking-widest mb-4">Production Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-3xl font-serif font-bold text-white">~2,000</p>
            <p className="text-sm text-brand-500">Assets Generated</p>
          </div>
           <div>
            <p className="text-3xl font-serif font-bold text-white">$40K</p>
            <p className="text-sm text-brand-500">Saved per Season</p>
          </div>
           <div>
            <p className="text-3xl font-serif font-bold text-white">80%</p>
            <p className="text-sm text-brand-500">AI Visual Assets</p>
          </div>
           <div>
            <p className="text-3xl font-serif font-bold text-white">100%</p>
            <p className="text-sm text-brand-500">Digital Workflow</p>
          </div>
        </div>
      </div>
    </div>
  );
};