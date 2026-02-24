import React from 'react';
import { Key, Camera, Layers, Wand2, Clapperboard, BrainCircuit, Mic2, ChevronRight, CheckCircle2 } from 'lucide-react';

const GuideSection: React.FC<{
  title: string;
  icon: any;
  steps: string[];
  description: string;
  colorClass: string;
}> = ({ title, icon: Icon, steps, description, colorClass }) => (
  <div className="bg-brand-900 border border-brand-800 rounded-2xl p-6 hover:border-brand-700 transition-colors">
    <div className="flex items-start gap-4 mb-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass.replace('text-', 'bg-').replace('400', '500/10')}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <h3 className="text-xl font-serif font-bold text-brand-100">{title}</h3>
        <p className="text-brand-400 text-sm mt-1">{description}</p>
      </div>
    </div>
    
    <div className="space-y-4 pl-4 border-l border-brand-800">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-3 text-sm">
          <span className="font-mono text-brand-600 font-bold shrink-0">{idx + 1}.</span>
          <p className="text-brand-300 leading-relaxed">
            {step.split('**').map((part, i) => 
              i % 2 === 1 ? <span key={i} className="text-brand-100 font-semibold">{part}</span> : part
            )}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export const Guide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">Studio Manual</h1>
        <p className="text-xl text-brand-400">Mastering the Phil Fash AI Production Suite.</p>
      </div>

      <div className="space-y-8">
        {/* Prerequisite */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 flex gap-4 items-start">
          <Key className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-indigo-300 mb-2">0. The Prerequisite: The Key</h3>
            <p className="text-indigo-200/80 text-sm leading-relaxed mb-4">
              When you first load the app, you will see a screen asking for "Studio Access." You must click **"Connect API Key"**. 
              This connects the app to Google's paid cloud servers (GCP). The "Veo" (video) and "Gemini 3 Pro" (high-res image) models require a billed account. Without this, the "engine" won't start.
            </p>
          </div>
        </div>

        <GuideSection 
          title="Virtual Catalog"
          icon={Camera}
          colorClass="text-indigo-400"
          description="Create high-end studio photography from scratch."
          steps={[
            "Navigate to **Catalog Generation** (Camera icon).",
            "In the **Prompt** box, describe your shot. Example: 'A full body shot of a male model wearing a beige linen suit, standing on a beach at sunset, soft warm lighting.'",
            "Select **Resolution**. Use 1K for quick tests, 4K for the final website image.",
            "Click **Generate Asset**.",
            "Wait about 5-10 seconds. Hover over the result and click the **Download icon** to save it.",
            "Use the **Upscale to 4K** button to enhance a favorite draft."
          ]}
        />

        <GuideSection 
          title="Batch Production"
          icon={Layers}
          colorClass="text-blue-400"
          description="Generate images for an entire product line at once."
          steps={[
            "Navigate to **Batch Production** (Layers icon).",
            "Choose your input method. **Single Entry** for one-offs, or **Bulk Text** for power users.",
            "For Bulk, paste a list using the format: `Name | Description | Style`.",
            "Click **Generate Batch**.",
            "The app will process them one by one. Green checkmarks appear as they finish.",
            "Click the **Download icon** next to any completed item."
          ]}
        />

        <GuideSection 
          title="Magic Editor"
          icon={Wand2}
          colorClass="text-purple-400"
          description="Fix or change an existing photo using natural language."
          steps={[
            "Navigate to **Magic Editor** (Wand icon).",
            "Click the box on the left to **Upload an Image**.",
            "Type what you want to change. Example: 'Change the background to a snowy mountain' or 'Make the shirt blue'.",
            "Click the **Wand button**.",
            "The AI preserves the structure but applies your changes."
          ]}
        />

        <GuideSection 
          title="Veo Runway (Video)"
          icon={Clapperboard}
          colorClass="text-pink-400"
          description="Create cinematic video clips for social media."
          steps={[
            "Navigate to **Runway** (Clapperboard icon).",
            "Choose **Text to Video** to describe a scene, or **Image to Video** to animate an existing photo.",
            "Select **Aspect Ratio** (9:16 for TikTok/Reels, 16:9 for Desktop).",
            "Click **Generate Footage**.",
            "Video takes 30-60 seconds. Do not close the tab while processing."
          ]}
        />

        <GuideSection 
          title="Trend Analyst"
          icon={BrainCircuit}
          colorClass="text-emerald-400"
          description="Have the AI explain fashion trends or analyze images."
          steps={[
            "Navigate to **Trend Analyst** (Brain icon).",
            "Upload reference images (e.g., competitor photos).",
            "Toggle **Deep Think**. Use 'On' for complex strategy, 'Off' for simple descriptions.",
            "Ask a question: 'What is the common color palette and emotional vibe?'",
            "Click **Deep Reason** to generate a report."
          ]}
        />

        <GuideSection 
          title="Voice Studio"
          icon={Mic2}
          colorClass="text-orange-400"
          description="Create a narration for your video ads."
          steps={[
            "Navigate to **Voiceover** (Mic icon).",
            "Type your script into the box.",
            "Click **Generate & Speak**.",
            "The AI (Fenrir voice) will read it out loud. Replay or record system audio to save."
          ]}
        />
      </div>
    </div>
  );
};