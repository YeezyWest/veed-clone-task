'use client';

import React from 'react';
import { Download, Share2, Play, Settings } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

export const Navbar = () => {
  const { isPlaying, setPlaying } = useEditorStore();

  return (
    <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950 px-6">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          V
        </div>
        <h1 className="text-sm font-medium text-zinc-200">Untitled Project</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 items-center gap-2 rounded-md bg-zinc-900 px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 border border-white/5">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button 
          onClick={() => {
            alert('Exporting video... (Simulation)');
          }}
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-lg shadow-blue-600/20"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </nav>
  );
};
