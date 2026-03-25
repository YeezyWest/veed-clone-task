'use client';

import React from 'react';
import { Download, Share2, Play, Settings } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

import { ExportModal } from './ExportModal';

export const Navbar = () => {
  const { isPlaying, setPlaying } = useEditorStore();
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  return (
    <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950 px-6">
      <div className="flex items-center gap-4">
        <div className="flex bg-blue-600/10 p-2 rounded-lg border border-blue-500/20">
          <Play className="h-4 w-4 text-blue-500 fill-current" />
        </div>
        <h1 className="text-sm font-bold tracking-tight text-white">MINI EDITOR <span className="text-[10px] font-medium text-zinc-500 align-top ml-1">BETA</span></h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 items-center gap-2 rounded-md bg-zinc-900 px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 border border-white/5">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button 
          onClick={() => setIsExportOpen(true)}
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-bold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </nav>
  );
};
