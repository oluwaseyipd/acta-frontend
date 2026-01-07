import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorMode = "light" | "dark" | "system";

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Theme
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;

  // View preferences
  taskViewMode: "list" | "kanban";
  setTaskViewMode: (mode: "list" | "kanban") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Command Palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // Theme
      colorMode: "system",
      setColorMode: (mode) => set({ colorMode: mode }),

      // View preferences
      taskViewMode: "list",
      setTaskViewMode: (mode) => set({ taskViewMode: mode }),
    }),
    {
      name: "acta-ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        colorMode: state.colorMode,
        taskViewMode: state.taskViewMode,
      }),
    },
  ),
);
