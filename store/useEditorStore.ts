import { create } from 'zustand';

export interface EditorItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text';
  url?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number; // in seconds
  duration: number; // in seconds
  trimStart?: number; // offsets the start time of the media file
  layer: number;
  content?: string; // for text items
}

interface EditorState {
  items: EditorItem[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedId: string | null;
  canvasFormat: string;
  backgroundColor: string;
  timelineHeight: number;
  sidebarWidth: number;
  isMobileSidebarOpen: boolean;
  zoomLevel: number;
  isMuted: boolean;
  
  // Actions
  addItem: (item: Omit<EditorItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<EditorItem>) => void;
  removeItem: (id: string) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setSelectedId: (id: string | null) => void;
  setDuration: (duration: number) => void;
  setCanvasFormat: (format: string) => void;
  setBackgroundColor: (color: string) => void;
  setTimelineHeight: (height: number) => void;
  setSidebarWidth: (width: number) => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  setMuted: (muted: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  items: [],
  currentTime: 0,
  duration: 60, // Default 60 seconds
  isPlaying: false,
  selectedId: null,
  canvasFormat: '16:9',
  backgroundColor: '#000000',
  timelineHeight: 256,
  sidebarWidth: 340,
  isMobileSidebarOpen: false,
  zoomLevel: 40,
  isMuted: false,

  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => item.id === id ? { ...item, ...updates } : item)
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setSelectedId: (id) => set({ selectedId: id }),
  setDuration: (duration) => set({ duration }),
  setCanvasFormat: (canvasFormat) => set({ canvasFormat }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setTimelineHeight: (timelineHeight) => set({ timelineHeight }),
  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setMuted: (isMuted) => set({ isMuted }),
}));
