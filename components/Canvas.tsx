'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Trash2, Monitor, ChevronDown } from 'lucide-react';

export const Canvas = () => {
  const { items, updateItem, removeItem, selectedId, setSelectedId, currentTime, isPlaying } = useEditorStore();

  const activeItems = items.filter(
    (item) => currentTime >= item.startTime && currentTime <= item.startTime + item.duration
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f8f8f8]">
      {/* Canvas Area */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="relative aspect-video w-full max-w-[650px] shrink-0 bg-black shadow-md ring-1 ring-gray-200" onClick={() => setSelectedId(null)}>
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
                  <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white font-bold px-2 text-center">
                    {item.content || item.name}
                  </div>
                )}
              </div>

              {/* Delete button — TOP-RIGHT inside bounds, always visible when selected */}
              {selectedId === item.id && (
                <button
                  onMouseDown={(e) => { e.stopPropagation(); }}
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); setSelectedId(null); }}
                  className="pointer-events-auto absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-transform hover:scale-110 z-50"
                  title="Delete item (or press Delete key)"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </Rnd>
          ))}
          
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <div className="h-16 w-24 border-2 border-dashed border-gray-600 rounded-lg mb-3 flex items-center justify-center">
                <Play className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-xs font-medium">Upload media to get started</p>
            </div>
          )}
        </div>
        
        {/* Under Canvas Controls Pill */}
        <div className="mt-4 flex shrink-0 items-center gap-4 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <button className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900">
            <Monitor className="h-4 w-4" />
            Original (16:9)
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <button className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900">
            <div className="h-4 w-4 rounded-full bg-black border border-gray-200" />
            Background
          </button>
        </div>
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
