'use client';

import React from 'react';
import { X, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [status, setStatus] = React.useState<'idle' | 'exporting' | 'done'>('idle');
  const [progress, setProgress] = React.useState(0);

  if (!isOpen) return null;

  const handleExport = () => {
    setStatus('exporting');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((v) => {
        if (v >= 100) {
          clearInterval(interval);
          setStatus('done');
          return 100;
        }
        return v + 2;
      });
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-blue-500/10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Export Video</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === 'idle' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Resolution</p>
                <p className="mt-1 text-lg font-bold text-white">1080p</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Format</p>
                <p className="mt-1 text-lg font-bold text-white">MP4</p>
              </div>
            </div>
            
            <button 
              onClick={handleExport}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Start Export
            </button>
          </div>
        )}

        {status === 'exporting' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-6" />
            <p className="text-lg font-bold text-white mb-2">Exporting your masterpiece...</p>
            <p className="text-sm text-zinc-500 mb-6">{progress}% complete</p>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="text-xl font-bold text-white mb-2">Export Complete!</p>
            <p className="text-sm text-zinc-400 mb-8">Your video is ready to be shared with the world.</p>
            <button 
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-white hover:bg-white/10 transition-colors"
            >
              Back to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
