// Create Post Store - Zustand store for post creation draft state
import { create } from 'zustand';
import type { MediaType, PostType } from '@/types';

export type AspectRatio = '1:1' | '4:5' | '9:16';

interface CreatePostState {
  // State
  mediaUri: string | null;
  mediaType: MediaType | null;
  aspectRatio: AspectRatio;
  croppedUri: string | null;
  selectedPetId: string | null;
  postType: PostType | null;
  selectedTags: string[];
  isUploading: boolean;
  error: string | null;

  // Actions
  setMedia: (uri: string, type: MediaType) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setCroppedUri: (uri: string) => void;
  setPet: (petId: string) => void;
  setPostType: (type: PostType) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  mediaUri: null,
  mediaType: null,
  aspectRatio: '1:1' as AspectRatio,
  croppedUri: null,
  selectedPetId: null,
  postType: null,
  selectedTags: [],
  isUploading: false,
  error: null,
};

export const useCreatePostStore = create<CreatePostState>((set, get) => ({
  ...initialState,

  setMedia: (uri: string, type: MediaType) => {
    set({ mediaUri: uri, mediaType: type, croppedUri: null, error: null });
  },

  setAspectRatio: (ratio: AspectRatio) => {
    set({ aspectRatio: ratio, croppedUri: null });
  },

  setCroppedUri: (uri: string) => {
    set({ croppedUri: uri });
  },

  setPet: (petId: string) => {
    set({ selectedPetId: petId, error: null });
  },

  setPostType: (type: PostType) => {
    set({ postType: type, error: null });
  },

  addTag: (tag: string) => {
    const { selectedTags } = get();
    if (selectedTags.length >= 5) {
      set({ error: 'Maximum 5 tags allowed' });
      return;
    }
    if (!selectedTags.includes(tag)) {
      set({ selectedTags: [...selectedTags, tag], error: null });
    }
  },

  removeTag: (tag: string) => {
    const { selectedTags } = get();
    set({ selectedTags: selectedTags.filter((t) => t !== tag) });
  },

  setIsUploading: (isUploading: boolean) => {
    set({ isUploading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));
