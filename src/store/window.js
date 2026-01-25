import { create} from "zustand";
import { immer} from "zustand/middleware/immer";
import {INITIAL_Z_INDEX, WINDOW_CONFIG} from "#constants/index.js";

const useWindowStore = create(
  immer((set) => ({
    windows: Object.fromEntries(
      Object.entries(WINDOW_CONFIG).map(([key, value]) => [
        key,
        { ...value, isFullscreen: false },
      ])
    ),
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) => set((state) =>{
      const win = state.windows[windowKey];
      if (win) {
        win.isOpen = true
        win.zIndex = state.nextZIndex
        win.data = data ?? win.data
        state.nextZIndex++
      }
    }),
    closeWindow: (windowKey) => set((state) =>{
      const win = state.windows[windowKey];
      if (win) {
        win.isOpen = false
        win.isFullscreen = false
      }
      state.nextZIndex++
    }),
    toggleFullscreen: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (win) {
        win.isFullscreen = !win.isFullscreen;
      }
    }),
    focusWindow: (windowKey) => set((state) =>{
      const win = state.windows[windowKey];
      if (win) {
        win.zIndex = state.nextZIndex++
      }
    }),
  }))
)

export default useWindowStore;