'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    setPlaying,
    currentTime,
    setCurrentTime,
    duration,
    selectedId,
    removeItem,
    setSelectedId,
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input / contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setPlaying(!isPlaying);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setCurrentTime(Math.max(0, currentTime - 1));
          break;

        case 'ArrowRight':
          e.preventDefault();
          setCurrentTime(Math.min(duration, currentTime + 1));
          break;

        case 'Delete':
        case 'Backspace':
          if (selectedId) {
            e.preventDefault();
            removeItem(selectedId);
            setSelectedId(null);
          }
          break;

        case 'Escape':
          setSelectedId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, selectedId, setPlaying, setCurrentTime, removeItem, setSelectedId]);
};
