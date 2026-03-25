'use client';

import React, { useRef } from 'react';
import { Upload, Video, Image as ImageIcon, Type, Music, Layout, Plus } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

const TOOLS = [
  { id: 'media', icon: Video, label: 'Media' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'elements', icon: Layout, label: 'Elements' },
];

export const Sidebar = () => {
  const { addItem } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      addItem({
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url: url,
        x: 50,
        y: 50,
        width: isVideo ? 320 : 200,
        height: isVideo ? 180 : 200,
        startTime: 0,
        duration: isVideo ? 10 : 5, // Mock duration
        layer: 1,
      });
    }
  };

  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-zinc-950">
      <div className="flex h-full">
        {/* Tool Icons */}
        <div className="flex w-16 flex-col items-center gap-4 border-r border-white/10 py-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            >
              <tool.icon className="h-5 w-5" />
              <span className="mt-1 text-[10px]">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Assets Panel */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Assets</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-zinc-800 p-1.5 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="video/*,image/*" 
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center transition-colors hover:border-white/20 hover:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 mb-3">
              <Upload className="h-6 w-6 text-zinc-400" />
            </div>
            <p className="text-xs font-medium text-zinc-300">Drag & drop media</p>
            <p className="mt-1 text-[10px] text-zinc-500">or click to upload</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-md bg-zinc-800 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-zinc-700"
            >
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
