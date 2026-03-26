'use client';

import React from 'react';
import { Download, Share2, Menu } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { useEditorStore } from '@/store/useEditorStore';

export const Navbar = () => {
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const { setMobileSidebarOpen } = useEditorStore();

  return (
    <>
      <nav className="flex h-12 items-center justify-between border-b border-[#e5e5e5] bg-white px-4">
        {/* Left: Logo + Project Name */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-1.5 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open Map Toolbar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-blue-500 shadow-sm">
            <span className="text-xs font-black text-white">V</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Untitled Project</span>
        </div>

        {/* Right: Share + Credits + Export */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-[#6d28d9] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#5b21b6] shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </nav>
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </>
  );
};
