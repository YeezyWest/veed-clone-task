'use client';

import React, { useRef, useState } from 'react';
import { Upload, Type, Layout, Search, Layers, Clapperboard, AudioWaveform, Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

const TOOLS = [
  { id: 'media', icon: ImageIcon, label: 'Media' },
  { id: 'audio', icon: AudioWaveform, label: 'Audio' },
  { id: 'subtitles', icon: Type, label: 'Subtitles' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'elements', icon: Layout, label: 'Elements' },
  { id: 'templates', icon: Layers, label: 'Templates' },
];

export const Sidebar = () => {
  const { items, addItem } = useEditorStore();
  const [activeTool, setActiveTool] = useState('media');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
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

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.type === 'image';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  return (
    <aside className="flex w-[340px] flex-col border-r border-[#e5e5e5] bg-white h-full z-10 shrink-0">
      <div className="flex h-full">
        {/* Leftmost Tool Icons Strip */}
        <div className="flex w-[72px] flex-col items-center gap-2 border-r border-[#e5e5e5] bg-[#f8f8f8] py-4 shrink-0">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex h-[60px] w-[60px] flex-col items-center justify-center rounded-xl transition-all ${
                activeTool === tool.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-[#e5e5e5]' 
                  : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800'
              }`}
            >
              <tool.icon className={`h-5 w-5 mb-1 ${activeTool === tool.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Inner Panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <div className="p-4 border-b border-transparent">
            {activeTool === 'media' && (
              <>
                <h2 className="text-sm font-semibold text-gray-800 mb-4">Assets Library</h2>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full rounded-md border border-[#e5e5e5] bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-400"
                  />
                </div>

                {/* Upload Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#e5e5e5] bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 mb-4"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </button>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('images')}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === 'images' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Images
                  </button>
                  <button 
                    onClick={() => setFilter('videos')}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === 'videos' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Videos
                  </button>
                </div>
              </>
            )}
            {activeTool !== 'media' && (
              <h2 className="text-sm font-semibold text-gray-800 mb-4 capitalize">{activeTool}</h2>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
            {activeTool === 'media' && (
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <div 
                    key={`asset-${item.id}`}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-[#e5e5e5] bg-gray-100 transition-all hover:border-blue-500 cursor-pointer shadow-sm"
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} className="h-full w-full object-cover" />
                    ) : (
                      <img src={item.url} className="h-full w-full object-cover" alt={item.name} />
                    )}
                    <div className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                      {item.type === 'video' ? 'Video' : 'Image'}
                    </div>
                  </div>
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#d0d0d0] bg-gray-50 py-12 text-center">
                    <p className="text-xs font-medium text-gray-500">No {filter !== 'all' ? filter : 'assets'} found</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTool !== 'media' && (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-xs font-medium text-gray-500 italic">Coming soon: {activeTool} options</p>
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
