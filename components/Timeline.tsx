'use client';

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Scissors, Film, ImageIcon, Trash2, ZoomIn, ZoomOut, Volume2, Maximize } from 'lucide-react';

import { Rnd } from 'react-rnd';

export const Timeline = () => {
  const { items, updateItem, removeItem, currentTime, setCurrentTime, duration, isPlaying, setPlaying, selectedId, setSelectedId } = useEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 40; // Increased for better resolution
  const totalWidth = duration * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('timeline-track-inner')) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + (scrollRef.current?.scrollLeft || 0);
      setCurrentTime(Math.min(Math.max(0, x / pixelsPerSecond), duration));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(Math.min(currentTime + 0.1, duration));
        if (currentTime >= duration) {
          setPlaying(false);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, setCurrentTime, setPlaying]);

  const formatTime = (time: number) => {
    const d = new Date(time * 1000);
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    const s = d.getUTCSeconds().toString().padStart(2, '0');
    const ms = Math.floor(d.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${m}:${s}.${ms}`;
  };

  return (
    <div className="flex h-64 flex-col border-t border-[#e5e5e5] bg-white">
      {/* VEED Toolbar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6">
        {/* Left: Split tool */}
        <div className="flex w-[200px] items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 transition-colors hover:text-gray-900">
            <Scissors className="h-4 w-4" />
            Split
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-1 items-center justify-center gap-6">
          <button 
            onClick={() => setCurrentTime(0)}
            className="text-gray-400 transition-colors hover:text-gray-800"
          >
            <SkipBack className="h-4 w-4 fill-current" />
          </button>
          <button 
             onClick={() => setPlaying(!isPlaying)}
             className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>
          <button className="text-gray-400 transition-colors hover:text-gray-800">
            <SkipForward className="h-4 w-4 fill-current" />
          </button>
          
          <div className="ml-2 text-xs font-medium text-gray-500 font-mono tracking-tight">
            <span className="text-black">{formatTime(currentTime)}</span> / {formatTime(duration)}
          </div>
        </div>

        {/* Right: Zoom & View Tools */}
        <div className="flex w-[200px] items-center justify-end gap-4 text-gray-400">
          <div className="flex items-center gap-2">
            <button className="hover:text-gray-800"><ZoomOut className="h-4 w-4" /></button>
            <div className="h-1 w-16 rounded-full bg-gray-200">
              <div className="h-full w-1/2 rounded-full bg-black"></div>
            </div>
            <button className="hover:text-gray-800"><ZoomIn className="h-4 w-4" /></button>
          </div>
          <button className="hover:text-gray-800"><Volume2 className="h-4 w-4" /></button>
          <button className="hover:text-gray-800"><Maximize className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Timeline Tracks Area */}
      <div 
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-auto timeline-track pt-8 bg-[#f8f8f8]"
        onClick={handleTimelineClick}
      >
        <div 
          className="timeline-track-inner relative h-full min-w-full"
          style={{ width: totalWidth }}
        >
          {/* Time Markers */}
          <div className="absolute top-0 flex h-6 w-full border-b border-[#e5e5e5] bg-white pointer-events-none z-10">
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
              <div 
                key={i} 
                className={`relative flex-shrink-0 border-l border-[#e5e5e5] ${i % 5 === 0 ? 'h-full' : 'h-2 top-auto bottom-0'} pl-1 text-[10px] font-medium text-gray-400`}
                style={{ width: pixelsPerSecond }}
              >
                {i % 5 === 0 ? `${i}s` : ''}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="flex flex-col gap-2 p-4 min-h-[120px]">
            {/* Background Add Media track placeholder */}
            <div className="relative h-[44px] w-full bg-transparent">
              <div 
                className="absolute left-0 top-0 h-full w-[280px] rounded-md border border-[#e5e5e5] bg-white flex items-center justify-center text-[11px] font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all cursor-pointer shadow-sm"
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              >
                + Add Media
              </div>
            </div>

            {items.map((item, index) => (
              <div key={`track-${item.id}`} className="relative h-[44px] w-full bg-transparent">
                <Rnd
                  size={{ width: item.duration * pixelsPerSecond, height: 44 }}
                  position={{ x: item.startTime * pixelsPerSecond, y: 0 }}
                  onDragStop={(e, d) => {
                    updateItem(item.id, { startTime: Math.max(0, d.x / pixelsPerSecond) });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    updateItem(item.id, {
                      duration: Math.max(0.5, parseInt(ref.style.width) / pixelsPerSecond),
                      startTime: Math.max(0, position.x / pixelsPerSecond),
                    });
                  }}
                  enableResizing={{ left: true, right: true }}
                  dragAxis="x"
                  bounds="parent"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedId(item.id);
                  }}
                  className={`group rounded-md text-[10px] shadow-sm overflow-hidden transition-all ${
                    selectedId === item.id 
                        ? 'ring-2 ring-blue-500 z-10' 
                        : 'border border-[#2d2d2d] hover:border-blue-500 z-0'
                  }`}
                  style={{ backgroundColor: '#1e1e1e' }}
                >
                  <div className="flex h-full w-full flex-col justify-center px-3 pr-8">
                    <div className="flex items-center gap-2">
                       {item.type === 'video' ? <Film className="h-3.5 w-3.5 text-blue-400" /> : <ImageIcon className="h-3.5 w-3.5 text-purple-400" />}
                       <span className="truncate font-medium text-white text-[11px]">{item.name}</span>
                    </div>
                    <span className="mt-0.5 text-[9px] text-gray-400">{(item.duration).toFixed(1)}s</span>
                  </div>

                  {/* Delete button — shown on selected clip */}
                  {selectedId === item.id && (
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); setSelectedId(null); }}
                      className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:scale-110 transition-transform z-50"
                      title="Delete clip"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  )}

                  {/* Handle indicators */}
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-white/20 hover:bg-white cursor-ew-resize rounded-l-sm" />
                  <div className="absolute inset-y-0 right-0 w-1.5 bg-white/20 hover:bg-white cursor-ew-resize rounded-r-sm" />
                </Rnd>
              </div>
            ))}
          </div>

          {/* VEED Style Playhead */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-px bg-black pointer-events-none"
            style={{ left: currentTime * pixelsPerSecond }}
          >
            <div className="absolute -left-[5px] top-0 h-3 w-[11px] bg-black rounded-b-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
