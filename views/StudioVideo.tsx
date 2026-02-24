import React, { useState, useRef, useEffect } from 'react';
import { generateVeoVideo, extendVeoVideo, optimizePrompt, transcribeAudio } from '../services/geminiService';
import { Upload, Film, Play, AlertCircle, Sparkles, RefreshCw, History, Clock, Mic, Square, Repeat } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const StudioVideo: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState("Cinematic slow motion shot of a silk dress flowing in the wind, studio lighting, 4k");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imageInput, setImageInput] = useState<{base64: string, mimeType: string} | null>(null);
  const [autoExtend, setAutoExtend] = useState(false);
  
  // Video State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoResource, setVideoResource] = useState<any>(null); // For extension
  const [duration, setDuration] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loopActive, setLoopActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const loopRef = useRef<boolean>(false); // To track loop state in async functions

  // Update ref when state changes so async loop can see it
  useEffect(() => {
    loopRef.current = loopActive;
  }, [loopActive]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Need pure base64 for the API
      const res = reader.result as string;
      const base64 = res.split(',')[1];
      setImageInput({
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMicDown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Mic error", e);
      alert("Could not access microphone");
    }
  };

  const handleMicUp = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        try {
          // Use 'audio/webm' or 'audio/mp4' depending on browser default, Gemini handles both.
          const transcription = await transcribeAudio(base64Audio, 'audio/webm');
          if (transcription) {
            setPrompt(transcription);
          }
        } catch (e) {
          console.error("Transcription failed", e);
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    // Stop all tracks
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  const handleGenerate = async () => {
    setLoading(true);
    setIsExtending(false);
    setError(null);
    setVideoUrl(null);
    setVideoResource(null);
    setDuration(0);
    setLoopActive(false);

    try {
        const result = await generateVeoVideo(prompt, aspectRatio, mode === 'image' && imageInput ? imageInput : undefined);
        setVideoUrl(result.url);
        setVideoResource(result.videoResource);
        const newDuration = 5;
        setDuration(newDuration);

        // Start auto-extend loop if enabled
        if (autoExtend) {
            setLoopActive(true);
            // Trigger loop after a short delay to let state settle
            setTimeout(() => runExtensionLoop(result.videoResource, newDuration), 500);
        }

    } catch (e: any) {
        setError(e.message || "Video generation failed.");
        console.error(e);
        setLoading(false);
    } finally {
        if (!autoExtend) {
            setLoading(false);
        }
    }
  };

  const runExtensionLoop = async (currentResource: any, currentDuration: number) => {
      // Loop until 60s or stopped
      if (!loopRef.current || currentDuration >= 60) {
          setLoading(false);
          setLoopActive(false);
          setIsExtending(false);
          return;
      }

      setIsExtending(true);
      try {
           // We use the prompt to guide the extension
           const extensionPrompt = prompt ? `Continue scene: ${prompt}` : "Continue the scene seamlessly";
           const result = await extendVeoVideo(extensionPrompt, currentResource, aspectRatio);
           
           setVideoUrl(result.url);
           setVideoResource(result.videoResource);
           const nextDuration = currentDuration + 5;
           setDuration(nextDuration);
           
           // Recursive call
           setTimeout(() => runExtensionLoop(result.videoResource, nextDuration), 1000);
      } catch (e: any) {
          setError(`Auto-extension stopped: ${e.message}`);
          setLoading(false);
          setLoopActive(false);
          setIsExtending(false);
      }
  };

  const handleExtend = async () => {
      if (!videoResource) return;
      setLoading(true);
      setIsExtending(true);
      setError(null);
      
      try {
        const extensionPrompt = prompt ? `Continue scene: ${prompt}` : "Continue the scene seamlessly";
        const result = await extendVeoVideo(extensionPrompt, videoResource, aspectRatio);
        setVideoUrl(result.url);
        setVideoResource(result.videoResource);
        setDuration(prev => prev + 5); 
      } catch (e: any) {
        setError(e.message || "Extension failed. Try again.");
        console.error(e);
      } finally {
        setLoading(false);
        setIsExtending(false);
      }
  };

  const stopLoop = () => {
      setLoopActive(false);
      setLoading(false);
  };

  const handleOptimize = async () => {
    if (!prompt) return;
    setOptimizing(true);
    try {
      const betterPrompt = await optimizePrompt(prompt, 'video');
      setPrompt(betterPrompt);
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <LoadingOverlay 
        isVisible={loading} 
        message={
            loopActive 
            ? `Auto-Building Timeline (${duration}s / 60s)...` 
            : isExtending 
            ? "Extending Scene..." 
            : "Producing Video on Runway..."
        } 
        subMessage={
            loopActive 
            ? "Recursively extending video segments. Please wait." 
            : isExtending 
            ? "Generating next segment with Veo." 
            : "Generating with Veo 3.1 Fast. This may take a minute."
        } 
      />

      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-serif font-bold">Veo Runway</h2>
            <p className="text-brand-400 text-sm">Generate cinematic video from prompts or bring images to life.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Mode Switcher */}
            <div className="bg-brand-900 border border-brand-800 p-1 rounded-xl flex">
                <button 
                    onClick={() => setMode('text')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'text' ? 'bg-brand-800 text-white shadow-sm' : 'text-brand-400 hover:text-brand-200'}`}
                >
                    Text to Video
                </button>
                <button 
                    onClick={() => setMode('image')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'image' ? 'bg-brand-800 text-white shadow-sm' : 'text-brand-400 hover:text-brand-200'}`}
                >
                    Image to Video
                </button>
            </div>

            <div className="bg-brand-900 border border-brand-800 p-6 rounded-2xl flex-1 flex flex-col gap-6">
                
                {mode === 'image' && (
                     <div 
                        className={`border-2 border-dashed ${imageInput ? 'border-brand-700 bg-brand-900' : 'border-brand-700 hover:border-pink-500 bg-brand-950'} rounded-xl p-4 cursor-pointer transition-colors relative h-40 flex items-center justify-center`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imageInput ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={`data:${imageInput.mimeType};base64,${imageInput.base64}`} alt="Ref" className="max-h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <Upload className="w-6 h-6 mx-auto mb-2 text-brand-500" />
                                <span className="text-xs text-brand-400">Upload Reference Image</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </div>
                )}

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-brand-500 uppercase tracking-wide">Prompt</label>
                        <div className="flex gap-2">
                            <button 
                                onMouseDown={handleMicDown}
                                onMouseUp={handleMicUp}
                                onMouseLeave={handleMicUp}
                                onTouchStart={handleMicDown}
                                onTouchEnd={handleMicUp}
                                className={`flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-800 text-brand-400 hover:text-brand-300'}`}
                            >
                                <Mic className="w-3 h-3" />
                                {isRecording ? "Listening..." : "Hold to Speak"}
                            </button>
                            <button 
                                onClick={handleOptimize}
                                disabled={optimizing || !prompt}
                                className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 px-2 py-1 rounded-md"
                            >
                                {optimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {optimizing ? "Enhancing..." : "Optimize"}
                            </button>
                        </div>
                    </div>
                    <textarea 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)}
                        className="w-full bg-brand-950 border border-brand-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none h-32 resize-none"
                        placeholder="Describe the camera movement, subject action, and lighting..."
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                         <label className="text-xs font-semibold text-brand-500 uppercase tracking-wide">Config</label>
                         <label className="flex items-center gap-2 cursor-pointer group">
                             <div className={`w-3 h-3 rounded-full border ${autoExtend ? 'bg-pink-500 border-pink-500' : 'border-brand-600 group-hover:border-pink-500'} transition-colors`}></div>
                             <input type="checkbox" className="hidden" checked={autoExtend} onChange={e => setAutoExtend(e.target.checked)} />
                             <span className={`text-xs ${autoExtend ? 'text-pink-400' : 'text-brand-500 group-hover:text-brand-400'}`}>Auto-Loop to 60s</span>
                         </label>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 py-2 text-sm border rounded-lg ${aspectRatio === '16:9' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'border-brand-700 text-brand-500'}`}
                        >
                            16:9 Landscape
                        </button>
                        <button 
                            onClick={() => setAspectRatio('9:16')}
                            className={`flex-1 py-2 text-sm border rounded-lg ${aspectRatio === '9:16' ? 'bg-pink-500/10 border-pink-500 text-pink-400' : 'border-brand-700 text-brand-500'}`}
                        >
                            9:16 Portrait
                        </button>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {loopActive ? (
                        <button 
                            onClick={stopLoop}
                            className="w-full py-4 bg-red-900/50 hover:bg-red-900/80 border border-red-500 text-red-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all animate-pulse"
                        >
                            <Square className="w-4 h-4 fill-current" />
                            Stop Auto-Loop ({duration}s)
                        </button>
                    ) : (
                        <button 
                            onClick={handleGenerate}
                            disabled={loading || !prompt || (mode === 'image' && !imageInput)}
                            className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {autoExtend ? <Repeat className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                            {autoExtend ? "Generate Full Minute" : "Generate Footage"}
                        </button>
                    )}
                    
                    {videoUrl && videoResource && !loopActive && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs px-1">
                                <span className="text-brand-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration: ~{duration}s
                                </span>
                                {duration < 60 && (
                                    <span className="text-pink-400">Target: 60s</span>
                                )}
                            </div>
                            <button 
                                onClick={handleExtend}
                                disabled={loading || duration >= 60}
                                className="w-full py-3 bg-brand-800 hover:bg-brand-700 border border-brand-700 text-brand-200 font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                            >
                                <History className="w-4 h-4" />
                                {duration >= 60 ? "Max Duration Reached" : "Extend Scene (+5s)"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
             {error && (
                <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-xl text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                </div>
            )}
        </div>

        {/* Player */}
        <div className="lg:col-span-8 bg-black rounded-2xl border border-brand-800 flex items-center justify-center overflow-hidden shadow-2xl relative">
            {videoUrl ? (
                <video controls autoPlay loop key={videoUrl} className="max-w-full max-h-full">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="text-center text-brand-700">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-mono text-sm">NO SIGNAL</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};