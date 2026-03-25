'use client';

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Clock, Scissors, SquareArrowOutUpRight, Film, ImageIcon, Trash2 } from 'lucide-react';

import { Rnd } from 'react-rnd';

export const Timeline = () => {
  const { items, updateItem, removeItem, currentTime, setCurrentTime, duration, isPlaying, setPlaying, selectedId, setSelectedId } = useEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 40; // Increased for better resolution
  const totalWidth = duration * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent) => {
    // Only seek if clicking the timeline track, not an item
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

  return (
    <div className="flex h-64 flex-col border-t border-white/10 bg-zinc-950">
      {/* Timeline Header/Controls */}
      <div className="flex h-12 items-center justify-between border-b border-white/5 px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-mono font-bold text-blue-500">
              {new Date(currentTime * 1000).toISOString().substr(11, 8)}
            </span>
            <span className="text-[10px] text-zinc-600">/ {new Date(duration * 1000).toISOString().substr(11, 8)}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <button className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
              <Scissors className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentTime(0)}
            className="text-zinc-500 transition-colors hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button 
             onClick={() => setPlaying(!isPlaying)}
             className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-white/10 transition-transform active:scale-90"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
          </button>
          <button className="text-zinc-500 transition-colors hover:text-white">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
            <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">1.0x</button>
        </div>
      </div>

      {/* Timeline Tracks Area */}
      <div 
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-auto timeline-track pt-10"
        onClick={handleTimelineClick}
      >
        <div 
          className="timeline-track-inner relative h-full min-w-full"
          style={{ width: totalWidth }}
        >
          {/* Time Markers */}
          <div className="absolute top-0 flex h-8 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm pointer-events-none z-10">
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
              <div 
                key={i} 
                className={`relative flex-shrink-0 border-l border-white/10 ${i % 5 === 0 ? 'h-full' : 'h-2 top-auto bottom-0'} pl-1 text-[9px] text-zinc-600`}
                style={{ width: pixelsPerSecond }}
              >
                {i % 5 === 0 ? `${i}s` : ''}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="flex h-full flex-col gap-2 p-2">
            {items.map((item, index) => (
              <div key={`track-${item.id}`} className="relative h-12 w-full bg-white/[0.02] rounded-lg border border-white/[0.02]">
                <Rnd
                  size={{ width: item.duration * pixelsPerSecond, height: 44 }}
                  position={{ x: item.startTime * pixelsPerSecond, y: 2 }}
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
                  className={`group rounded-md border text-[10px] shadow-lg overflow-hidden transition-colors ${
                    selectedId === item.id 
                        ? 'border-blue-500 bg-blue-500/20 ring-1 ring-blue-500/50' 
                        : 'border-white/10 bg-zinc-900 hover:border-white/20'
                  }`}
                >
                  <div className="flex h-full w-full flex-col justify-center px-3 pr-8">
                    <div className="flex items-center gap-2">
                      {item.type === 'video' ? <Film className="h-3 w-3 text-blue-400" /> : <ImageIcon className="h-3 w-3 text-purple-400" />}
                      <span className="truncate font-semibold text-zinc-200">{item.name}</span>
                    </div>
                    <span className="mt-0.5 text-[8px] text-zinc-500">{(item.duration).toFixed(1)}s</span>
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
                  <div className="absolute inset-y-0 left-0 w-1 bg-white/10 group-hover:bg-blue-500/30" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-white/10 group-hover:bg-blue-500/30" />
                </Rnd>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-px bg-blue-500 pointer-events-none"
            style={{ left: currentTime * pixelsPerSecond }}
          >
            <div className="absolute -left-1.5 -top-1 h-3 w-3 rotate-45 border-2 border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/40" />
            <div className="absolute -left-px top-0 h-full w-px bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
};
