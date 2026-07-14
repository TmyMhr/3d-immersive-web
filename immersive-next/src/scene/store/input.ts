"use client";
import { create } from "zustand";

type Vec2 = { x: number; y: number };

type InputState = {
  move: Vec2;
  jump: boolean;
  lookDelta: Vec2;
  setMove: (v: Vec2) => void;
  setJump: (j: boolean) => void;
  addLookDelta: (v: Vec2) => void;
  consumeLookDelta: () => Vec2;
  reset: () => void;
};

export const useInputStore = create<InputState>((set, get) => ({
  move: { x: 0, y: 0 },
  jump: false,
  lookDelta: { x: 0, y: 0 },
  setMove: (v) => set({ move: v }),
  setJump: (j) => set({ jump: j }),
  addLookDelta: (v) =>
    set((s) => ({
      lookDelta: { x: s.lookDelta.x + v.x, y: s.lookDelta.y + v.y },
    })),
  consumeLookDelta: () => {
    const delta = get().lookDelta;
    set({ lookDelta: { x: 0, y: 0 } });
    return delta;
  },
  reset: () => set({ move: { x: 0, y: 0 }, jump: false, lookDelta: { x: 0, y: 0 } }),
}));
