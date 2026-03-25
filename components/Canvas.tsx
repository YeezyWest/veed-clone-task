'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const Canvas = () => {
  const { items, updateItem, selectedId, setSelectedId } = useEditorStore();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-900/50">
      {/* Canvas Area */}
      <div className="relative flex flex-1 items-center justify-center p-8">
        <div className="relative aspect-video w-full max-w-[800px] bg-black shadow-2xl shadow-blue-500/5 ring-1 ring-white/5">
          {items.map((item) => (
            <Rnd
              key={item.id}
              size={{ width: item.width, height: item.height }}
              position={{ x: item.x, y: item.y }}
              onDragStop={(e, d) => {
                updateItem(item.id, { x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateItem(item.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                });
              }}
              bounds="parent"
              onClick={() => setSelectedId(item.id)}
              className={`group border-2 ${
                selectedId === item.id ? 'border-blue-500' : 'border-transparent'
              } hover:border-blue-500/50 transition-colors`}
            >
              <div className="relative h-full w-full pointer-events-none">
                {item.type === 'video' ? (
                  <video 
                    src={item.url} 
                    className="h-full w-full object-cover" 
                    draggable={false}
                  />
                ) : item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    className="h-full w-full object-cover" 
                    draggable={false}
                    alt={item.name}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white font-bold">
                    {item.name}
                  </div>
                )}
                {/* Overlay labels/controls can go here */}
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      {/* Quick Playback Controls (Optional Overlay) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full glass px-6 py-2.5 shadow-xl">
        <button className="text-zinc-400 transition-colors hover:text-blue-500">
          <SkipBack className="h-5 w-5 fill-current" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-transform active:scale-95">
          <Play className="h-5 w-5 fill-current" />
        </button>
        <button className="text-zinc-400 transition-colors hover:text-blue-500">
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </div>

      {/* Resolution/Background indicators */}
      <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] font-medium text-zinc-400">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        1080p | 60fps
      </div>
    </div>
  );
};
