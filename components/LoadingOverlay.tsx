import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay: React.FC<Props> = ({ isVisible, message = "Processing...", subMessage }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 bg-brand-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">{message}</h3>
      {subMessage && <p className="text-brand-400 max-w-sm animate-pulse">{subMessage}</p>}
    </div>
  );
};