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
  const { items, addItem } = useEditorStore();
  const [activeTool, setActiveTool] = React.useState('media');
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
        x: 100,
        y: 100,
        width: isVideo ? 400 : 300,
        height: isVideo ? 225 : 300,
        startTime: 0,
        duration: isVideo ? 10 : 5,
        layer: items.length + 1,
      });
    }
  };

  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-zinc-950">
      <div className="flex h-full">
        {/* Tool Icons */}
        <div className="flex w-20 flex-col items-center gap-2 border-r border-white/5 py-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl transition-all ${
                activeTool === tool.id 
                  ? 'bg-blue-600/10 text-blue-500 shadow-inner' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <tool.icon className={`h-5 w-5 ${activeTool === tool.id ? 'fill-current' : ''}`} />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-tighter">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Assets Panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{activeTool}</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white transition-transform hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/20"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTool === 'media' && (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] p-8 text-center transition-all hover:border-blue-500/30 hover:bg-blue-500/[0.02] cursor-pointer group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 mb-3 group-hover:scale-110 transition-transform shadow-xl">
                    <Upload className="h-6 w-6 text-zinc-400 group-hover:text-blue-500" />
                  </div>
                  <p className="text-[11px] font-bold text-zinc-300">Upload Media</p>
                  <p className="mt-1 text-[9px] text-zinc-500">Video, Image or Audio</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {items.map((item) => (
                    <div 
                      key={`asset-${item.id}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-all hover:border-blue-500/50"
                    >
                      {item.type === 'video' ? (
                        <video src={item.url} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <img src={item.url} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.name} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="absolute bottom-2 left-2 right-2 truncate text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTool !== 'media' && (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-[10px] font-medium text-zinc-600 italic">Coming soon: {activeTool} library</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="video/*,image/*" 
      />
    </aside>
  );
};
