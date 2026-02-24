import React, { useEffect, useState } from 'react';
import { Key, AlertTriangle, ExternalLink } from 'lucide-react';

export const ApiKeyChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
        // Fallback for development outside of specific environment, mostly assumes key present if env var is there
        // But for this specific challenge, we simulate the 'paid key' requirement flow if the window object exists.
        setHasKey(true);
    }
    setChecking(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success after dialog interaction to avoid race condition
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
        // Reset to force retry if needed
        setHasKey(false); 
      }
    }
  };

  if (checking) return <div className="flex items-center justify-center h-full text-brand-400">Verifying Studio Access...</div>;

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <div className="bg-brand-900 border border-brand-800 p-8 rounded-2xl max-w-md shadow-2xl">
          <div className="bg-brand-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Studio Access Required</h2>
          <p className="text-brand-400 mb-6">
            To use the advanced production models (Veo, Gemini 3 Pro), you must connect a valid API key from a paid GCP project.
          </p>
          
          <button 
            onClick={handleSelectKey}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Connect API Key
          </button>
          
          <div className="mt-6 pt-6 border-t border-brand-800 text-xs text-brand-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 hover:text-brand-300">
              <ExternalLink className="w-3 h-3" />
              Billing Documentation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};