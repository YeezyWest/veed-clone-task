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
  layer: number;
  content?: string; // for text items
}

interface EditorState {
  items: EditorItem[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedId: string | null;
  
  // Actions
  addItem: (item: Omit<EditorItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<EditorItem>) => void;
  removeItem: (id: string) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setSelectedId: (id: string | null) => void;
  setDuration: (duration: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  items: [],
  currentTime: 0,
  duration: 60, // Default 60 seconds
  isPlaying: false,
  selectedId: null,

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
}));
