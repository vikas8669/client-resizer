import { create } from 'zustand';

export interface EditorSettings {
  width: number | null;
  height: number | null;
  quality: number;
  format: 'jpeg' | 'png';
  preset: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  lockAspectRatio: boolean;
}

export interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EditorState {
  originalFile: File | null;
  originalImageUrl: string | null;
  processedImageUrl: string | null;
  settings: EditorSettings;
  crop: CropState | null;
  isProcessing: boolean;
  
  setOriginalFile: (file: File) => void;
  setOriginalImageUrl: (url: string) => void;
  setProcessedImageUrl: (url: string | null) => void;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  setCrop: (crop: CropState | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  reset: () => void;
}

const defaultSettings: EditorSettings = {
  width: null,
  height: null,
  quality: 80,
  format: 'jpeg',
  preset: null,
  focalX: 0,
  focalY: 0,
  zoom: 1,
  lockAspectRatio: true,
};

export const useEditorStore = create<EditorState>((set) => ({
  originalFile: null,
  originalImageUrl: null,
  processedImageUrl: null,
  settings: defaultSettings,
  crop: null,
  isProcessing: false,

  setOriginalFile: (file) => {
    set((state) => {
      if (state.originalImageUrl && state.originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.originalImageUrl);
      }
      return { 
        originalFile: file, 
        originalImageUrl: URL.createObjectURL(file),
        processedImageUrl: null,
      };
    });
  },
  setOriginalImageUrl: (url) => set({ originalImageUrl: url }),
  setProcessedImageUrl: (url) => set({ processedImageUrl: url }),
  updateSettings: (newSettings) => set((state) => ({ 
    settings: { ...state.settings, ...newSettings } 
  })),
  setCrop: (crop) => set({ crop }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  reset: () => set((state) => {
    if (state.originalImageUrl && state.originalImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.originalImageUrl);
    }
    return {
      originalFile: null,
      originalImageUrl: null,
      processedImageUrl: null,
      settings: defaultSettings,
      crop: null,
      isProcessing: false,
    };
  }),
}));
