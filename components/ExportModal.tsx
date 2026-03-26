'use client';

import React from 'react';
import { X, CheckCircle2, Download, Loader2, FileVideo } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const store = useEditorStore();
  const { items } = store;
  const [status, setStatus] = React.useState<'idle' | 'exporting' | 'done'>('idle');
  const [progress, setProgress] = React.useState(0);
  const [progressText, setProgressText] = React.useState('Preparing rendering engine...');

  React.useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setProgress(0);
      setProgressText('Preparing rendering engine...');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (items.length === 0) {
      alert('No media to export. Please add media to the timeline first.');
      return;
    }
    setStatus('exporting');
    setProgress(0);
    setProgressText('Loading FFmpeg WebAssembly...');

    try {
      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', ({ message }) => console.log(message));
      ffmpeg.on('progress', ({ progress, time }) => {
        setProgress(Math.round(Math.min(progress, 1) * 100));
        setProgressText(`Rendering video: ${Math.round(progress * 100)}%`);
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setProgressText('Processing media files...');
      
      const inputs: string[] = [];
      let filterComplex = `color=c=black:s=1280x720:d=${store.duration} [bg];`;
      
      const exportableItems = items.filter(i => i.url);

      for (let i = 0; i < exportableItems.length; i++) {
        const item = exportableItems[i];
        const ext = item.type === 'video' ? 'mp4' : 'png';
        const filename = `input_${i}.${ext}`;
        
        // Fetch raw blob data robustly
        const response = await fetch(item.url!);
        const arrayBuffer = await response.arrayBuffer();
        await ffmpeg.writeFile(filename, new Uint8Array(arrayBuffer));

        if (item.type === 'video') {
           inputs.push('-i', filename);
           filterComplex += `[${i}:v]trim=start=${item.trimStart || 0}:duration=${item.duration},setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=rgba[v${i}];`;
        } else {
           // For images, continuously loop it to mimic a video stream
           inputs.push('-loop', '1', '-framerate', '30', '-t', item.duration.toString(), '-i', filename);
           filterComplex += `[${i}:v]setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=rgba[v${i}];`;
        }
      }

      // Chain overlays together sequentially
      let lastOverlay = '[bg]';
      for (let i = 0; i < exportableItems.length; i++) {
        const item = exportableItems[i];
        const nextOverlay = `[ov${i}]`;
        filterComplex += `${lastOverlay}[v${i}]overlay=enable='between(t,${item.startTime},${item.startTime + item.duration})':format=auto${nextOverlay};`;
        lastOverlay = nextOverlay;
      }

      // Remove the final trailing semicolon! (Crucial to prevent FFmpeg syntax error)
      filterComplex = filterComplex.replace(/;$/, '');

      const args = [
        ...inputs,
        '-filter_complex', filterComplex,
        '-map', lastOverlay,
        '-t', store.duration.toString(),
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
      ];

      setProgressText('Encoding final timeline sequence...');
      await ffmpeg.exec(args);
      
      setProgressText('Downloading...');
      const data = await ffmpeg.readFile('output.mp4');
      
      const blob = new Blob([data as any], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Untitled_Project.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus('done');
    } catch (e) {
      console.error('Export failed', e);
      alert('Export failed due to a rendering error. Please check the console log for details.');
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
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
                <p className="mt-1 text-lg font-bold text-white">720p HD</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Timeline</p>
                <p className="mt-1 text-lg font-bold text-white">{items.length} Clip{items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 border border-white/5">
              <FileVideo className="h-5 w-5 text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Rendered Video Output</span>
                <span className="text-xs text-zinc-500">.mp4 format (H.264 Video)</span>
              </div>
            </div>

            {items.length === 0 && (
              <p className="text-center text-sm text-zinc-500">Add media to the timeline first.</p>
            )}

            <button
              onClick={handleExport}
              disabled={items.length === 0}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              Render Video
            </button>
          </div>
        )}

        {status === 'exporting' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-6" />
            <p className="text-lg font-bold text-white mb-2">Generating Video...</p>
            <p className="text-sm text-zinc-500 mb-6">{progressText}</p>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-[200ms] ease-out"
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
            <p className="text-xl font-bold text-white mb-2">Export Complete!</p>
            <p className="text-sm text-zinc-400 mb-8">
              Your composed .mp4 video has been successfully rendered.
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
