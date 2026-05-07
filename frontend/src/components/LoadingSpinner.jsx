import React from 'react';
import { Bike } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = true, text = "Loading..." }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen bg-earth-900' : 'py-20'}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-forest-900 border-t-forest-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Bike size={20} className="text-forest-400 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-400 text-sm font-mono tracking-wider">{text}</p>
    </div>
  );
}
