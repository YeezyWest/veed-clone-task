'use client';

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Clock, Scissors, SquareArrowOutUpRight } from 'lucide-react';

export const Timeline = () => {
  const { items, currentTime, setCurrentTime, duration, isPlaying, setPlaying } = useEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = 20;
  const totalWidth = duration * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setCurrentTime(Math.min(Math.max(0, x / pixelsPerSecond), duration));
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
             className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-90"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </button>
          <button className="text-zinc-500 transition-colors hover:text-white">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Timeline Tracks Area */}
      <div 
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-hidden timeline-track"
        onClick={handleTimelineClick}
      >
        <div 
          className="relative h-full"
          style={{ width: totalWidth }}
        >
          {/* Time Markers */}
          <div className="absolute top-0 flex h-6 w-full border-b border-white/5 bg-zinc-900/40">
            {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
              <div 
                key={i} 
                className="relative flex-shrink-0 border-l border-white/10 pl-1 text-[9px] text-zinc-600"
                style={{ width: pixelsPerSecond }}
              >
                {i % 5 === 0 ? `${i}s` : ''}
              </div>
            ))}
          </div>

          {/* Items on Timeline */}
          <div className="flex h-full flex-col gap-1.5 pt-8 px-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group relative h-12 rounded-md border text-[10px] shadow-sm transition-all ${
                  item.type === 'video' 
                    ? 'border-blue-500/20 bg-blue-500/10 text-blue-300' 
                    : 'border-purple-500/20 bg-purple-500/10 text-purple-300'
                }`}
                style={{
                  left: item.startTime * pixelsPerSecond,
                  width: item.duration * pixelsPerSecond,
                }}
              >
                <div className="truncate p-2 font-medium">{item.name}</div>
                <div className="absolute inset-y-0 left-0 w-1 cursor-ew-resize rounded-l-md hover:bg-white/30" />
                <div className="absolute inset-y-0 right-0 w-1 cursor-ew-resize rounded-r-md hover:bg-white/30" />
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 z-10 w-px bg-blue-500 pointer-events-none"
            style={{ left: currentTime * pixelsPerSecond }}
          >
            <div className="absolute -left-1.5 -top-1 h-3 w-3 rotate-45 border-2 border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
