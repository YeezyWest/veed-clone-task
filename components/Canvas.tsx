'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Trash2 } from 'lucide-react';

export const Canvas = () => {
  const { items, updateItem, removeItem, selectedId, setSelectedId, currentTime, isPlaying } = useEditorStore();

  const activeItems = items.filter(
    (item) => currentTime >= item.startTime && currentTime <= item.startTime + item.duration
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-900/50">
      {/* Canvas Area */}
      <div className="relative flex flex-1 items-center justify-center p-8">
        <div className="relative aspect-video w-full max-w-[800px] bg-black shadow-2xl shadow-blue-500/5 ring-1 ring-white/5 overflow-hidden">
          {activeItems.map((item) => (
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
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setSelectedId(item.id);
              }}
              style={{ zIndex: item.layer }}
              className={`group border-2 ${
                selectedId === item.id ? 'border-blue-500' : 'border-transparent'
              } hover:border-blue-500/50 transition-colors cursor-move`}
            >
              <div className="relative h-full w-full pointer-events-none overflow-hidden rounded-sm">
                {item.type === 'video' ? (
                  <VideoItem item={item} currentTime={currentTime} isPlaying={isPlaying} />
                ) : item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    className="h-full w-full object-cover" 
                    draggable={false}
                    alt={item.name}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white font-bold px-2 text-center">
                    {item.content || item.name}
                  </div>
                )}
              </div>

              {/* Delete button — visible when selected */}
              {selectedId === item.id && (
                <button
                  onMouseDown={(e) => { e.stopPropagation(); }}
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); setSelectedId(null); }}
                  className="pointer-events-auto absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/40 transition-transform hover:scale-110 z-50"
                  title="Delete item (or press Delete key)"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </Rnd>
          ))}
          
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
              <div className="h-20 w-32 border-2 border-dashed border-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">Upload media to get started</p>
            </div>
          )}
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

const VideoItem = ({ item, currentTime, isPlaying }: { item: any, currentTime: number, isPlaying: boolean }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { setCurrentTime } = useEditorStore();

  // Only seek when PAUSED (manual scrubbing). Never interrupt a playing video.
  React.useEffect(() => {
    if (!isPlaying && videoRef.current) {
      const targetTime = currentTime - item.startTime;
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.15) {
        videoRef.current.currentTime = Math.max(0, targetTime);
      }
    }
  }, [currentTime, item.startTime, isPlaying]);

  // Play / Pause
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Let the video drive the editor clock during playback
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (isPlaying) {
        setCurrentTime(item.startTime + video.currentTime);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPlaying, item.startTime, setCurrentTime]);

  return (
    <video
      ref={videoRef}
      src={item.url}
      className="h-full w-full object-cover"
      playsInline
    />
  );
};
