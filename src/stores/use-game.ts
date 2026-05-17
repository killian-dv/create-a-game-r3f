import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameStore {
  phase: "ready" | "playing" | "ended";
  blocksCount: number;
  blocksSeed: number;
  startTime: number;
  endTime: number;
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    blocksCount: 10,
    blocksSeed: Math.random(),
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
        set({
          phase: "ready",
          startTime: 0,
          endTime: 0,
          blocksSeed: Math.random(),
        });
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
