// Video Store - Session-level video playback preferences
// Implements Ticket 014: Video Playback in Feed

import { create } from 'zustand';

interface VideoState {
  // Session preferences (not persisted)
  isMuted: boolean;

  // Actions
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  // Default: unmuted
  isMuted: false,

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setMuted: (muted: boolean) => set({ isMuted: muted }),
}));
