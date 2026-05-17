import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameStore {
  phase: "ready" | "playing" | "ended";
  blocksCount: number;
  startTime: number;
  endTime: number;
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    blocksCount: 3,
    startTime: 0,
    endTime: 0,
    start: () => {
      if (get().phase === "ready") {
        set({ phase: "playing" });
        set({ startTime: Date.now() });
      }
    },
    restart: () => {
      if (get().phase === "ended" || get().phase === "playing") {
        set({ phase: "ready" });
        set({ startTime: 0 });
        set({ endTime: 0 });
      }
    },
    end: () => {
      if (get().phase === "playing") {
        set({ phase: "ended" });
        set({ endTime: Date.now() });
      }
    },
  })),
);
