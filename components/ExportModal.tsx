'use client';

import React from 'react';
import { X, CheckCircle2, Download, Loader2, FileVideo } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const { items } = useEditorStore();
  const [status, setStatus] = React.useState<'idle' | 'exporting' | 'done'>('idle');
  const [progress, setProgress] = React.useState(0);

  // Reset state each time modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const videoItems = items.filter((i) => i.url);

  const triggerDownloads = async () => {
    for (const item of videoItems) {
      if (!item.url) continue;
      try {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const ext = item.type === 'video' ? 'mp4' : blob.type.split('/')[1] || 'png';
        const cleanName = item.name.replace(/\.[^/.]+$/, '');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cleanName}_export.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // If fetch fails (e.g., CORS), fall back to direct href download
        const a = document.createElement('a');
        a.href = item.url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleExport = () => {
    if (videoItems.length === 0) {
      alert('No media to export. Please add media to the timeline first.');
      return;
    }
    setStatus('exporting');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((v) => {
        if (v >= 100) {
          clearInterval(interval);
          setStatus('done');
          triggerDownloads();
          return 100;
        }
        return v + 4;
      });
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl shadow-blue-500/10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Export Video</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === 'idle' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Resolution</p>
                <p className="mt-1 text-lg font-bold text-white">Original</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Files</p>
                <p className="mt-1 text-lg font-bold text-white">{videoItems.length} item{videoItems.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {videoItems.length > 0 && (
              <div className="space-y-2">
                {videoItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-2.5 border border-white/5">
                    <FileVideo className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="truncate text-xs text-zinc-300">{item.name}</span>
                    <span className="ml-auto text-[10px] text-zinc-500 uppercase shrink-0">{item.type}</span>
                  </div>
                ))}
              </div>
            )}

            {videoItems.length === 0 && (
              <p className="text-center text-sm text-zinc-500">Add media to the timeline first.</p>
            )}

            <button
              onClick={handleExport}
              disabled={videoItems.length === 0}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              Download {videoItems.length > 1 ? `${videoItems.length} Files` : 'File'}
            </button>
          </div>
        )}

        {status === 'exporting' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-6" />
            <p className="text-lg font-bold text-white mb-2">Preparing your files...</p>
            <p className="text-sm text-zinc-500 mb-6">{progress}% complete</p>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="text-xl font-bold text-white mb-2">Download Started!</p>
            <p className="text-sm text-zinc-400 mb-8">
              {videoItems.length === 1 
                ? 'Your file is downloading now.' 
                : `${videoItems.length} files are downloading.`}
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-white hover:bg-white/10 transition-colors"
            >
              Back to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
