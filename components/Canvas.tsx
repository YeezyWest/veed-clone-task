'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, Trash2, Monitor, ChevronDown } from 'lucide-react';

const FORMATS = [
  { id: '16:9', label: 'Wide Landscape' },
  { id: '9:16', label: 'Tall Portrait' },
  { id: '1:1', label: 'Square' },
  { id: '4:5', label: 'Portrait' },
  { id: '4:3', label: 'Boxy Landscape' },
  { id: '5:4', label: 'Landscape' },
];

export const Canvas = () => {
  const { items, addItem, updateItem, removeItem, selectedId, setSelectedId, currentTime, isPlaying, canvasFormat, setCanvasFormat, backgroundColor, setBackgroundColor } = useEditorStore();
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFormatMenu(false);
        setShowColorMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeItems = items.filter(
    (item) => currentTime >= item.startTime && currentTime <= item.startTime + item.duration
  );

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');
      if (!isVideo && !isImage) return;

      const url = URL.createObjectURL(file);
      const itemWidth = isVideo ? 400 : 300;
      const itemHeight = isVideo ? 225 : 300;
      
      let x = 100;
      let y = 100;
      
      const canvasEl = document.getElementById('canvas-container');
      if (canvasEl) {
        x = Math.max(0, (canvasEl.clientWidth - itemWidth) / 2);
        y = Math.max(0, (canvasEl.clientHeight - itemHeight) / 2);
      }

      addItem({
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url: url,
        x,
        y,
        width: itemWidth,
        height: itemHeight,
        startTime: 0,
        duration: isVideo ? 10 : 5,
        trimStart: 0,
        layer: items.length + 1,
      });
    }
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f8f8f8]">
      {/* Canvas Area */}
      <div 
        className="relative flex flex-1 flex-col items-center justify-center p-6 min-h-0 overflow-y-auto custom-scrollbar"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCanvasDrop}
      >
        <div 
          id="canvas-container"
          className="relative w-full max-w-[650px] shrink-0 shadow-md ring-1 ring-gray-200 transition-all duration-300"
          style={{ 
             aspectRatio: canvasFormat.replace(':', '/'),
             backgroundColor: backgroundColor 
          }}
          onClick={() => setSelectedId(null)}
        >
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
        <div ref={menuRef} className="relative mt-4 flex shrink-0 items-center gap-4 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <button 
            onClick={() => { setShowFormatMenu(!showFormatMenu); setShowColorMenu(false); }}
            className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            <Monitor className="h-4 w-4" />
            {FORMATS.find(f => f.id === canvasFormat)?.label || 'Custom'} ({canvasFormat})
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          
          <div className="h-4 w-px bg-gray-200" />
          
          <button 
            onClick={() => { setShowColorMenu(!showColorMenu); setShowFormatMenu(false); }}
            className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            <div className="h-4 w-4 rounded-full border border-gray-200" style={{ backgroundColor }} />
            Background
          </button>

          {/* Format Menu Popup */}
          {showFormatMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-64 rounded-xl border border-gray-200 bg-white shadow-lg p-2 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500">Custom</div>
              {FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => { setCanvasFormat(format.id); setShowFormatMenu(false); }}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${canvasFormat === format.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-current rounded-[2px] opacity-60" style={{ aspectRatio: format.id.replace(':', '/') }} />
                    <span className="font-medium">{format.label}</span> 
                    <span className="text-gray-400 text-xs ml-1">({format.id})</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Color Menu Popup */}
          {showColorMenu && (
            <div className="absolute bottom-full mb-2 right-0 w-64 rounded-xl border border-gray-200 bg-white shadow-lg p-4 z-50">
              <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-800">
                <span>Color</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#ffffff', '#f87171', '#fb923c', '#fbbf24', '#4ade80', '#2dd4bf', '#3b82f6', '#818cf8', '#a78bfa', '#f472b6', '#e4e4e7', '#52525b', '#18181b', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => { setBackgroundColor(color); setShowColorMenu(false); }}
                    className={`h-8 w-8 rounded-full border border-gray-200 transition-all ${backgroundColor === color ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500">Custom Hex</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-8 w-8 shrink-0 rounded cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoItem = ({ item, currentTime, isPlaying }: { item: any, currentTime: number, isPlaying: boolean }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { setCurrentTime, isMuted } = useEditorStore();

  // Only seek when PAUSED (manual scrubbing). Never interrupt a playing video.
  React.useEffect(() => {
    if (!isPlaying && videoRef.current) {
      const targetTime = (currentTime - item.startTime) + (item.trimStart || 0);
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.15) {
        videoRef.current.currentTime = Math.max(0, targetTime);
      }
    }
  }, [currentTime, item.startTime, item.trimStart, isPlaying]);

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
      muted={isMuted}
    />
  );
};
