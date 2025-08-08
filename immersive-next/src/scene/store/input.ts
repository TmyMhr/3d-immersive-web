"use client";
import { create } from "zustand";

type Vec2 = { x: number; y: number };

type InputState = {
  move: Vec2; // -1..1
  jump: boolean;
  setMove: (v: Vec2) => void;
  setJump: (j: boolean) => void;
  reset: () => void;
};

export const useInputStore = create<InputState>((set) => ({
  move: { x: 0, y: 0 },
  jump: false,
  setMove: (v) => set({ move: v }),
  setJump: (j) => set({ jump: j }),
  reset: () => set({ move: { x: 0, y: 0 }, jump: false }),
}));


