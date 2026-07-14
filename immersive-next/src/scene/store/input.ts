"use client";
import { create } from "zustand";

type Vec2 = { x: number; y: number };

// High-frequency look input kept in a ref to avoid per-frame store writes.
export const lookDeltaRef = { x: 0, y: 0 };

type InputState = {
  move: Vec2;
  jump: boolean;
  setMove: (v: Vec2) => void;
  setJump: (j: boolean) => void;
  addLookDelta: (v: Vec2) => void;
  consumeLookDelta: () => Vec2;
  reset: () => void;
};

export const useInputStore = create<InputState>(() => ({
  move: { x: 0, y: 0 },
  jump: false,
  setMove: (v) => useInputStore.setState({ move: v }),
  setJump: (j) => useInputStore.setState({ jump: j }),
  addLookDelta: (v) => {
    lookDeltaRef.x += v.x;
    lookDeltaRef.y += v.y;
  },
  consumeLookDelta: () => {
    const delta = { x: lookDeltaRef.x, y: lookDeltaRef.y };
    lookDeltaRef.x = 0;
    lookDeltaRef.y = 0;
    return delta;
  },
  reset: () => {
    lookDeltaRef.x = 0;
    lookDeltaRef.y = 0;
    useInputStore.setState({ move: { x: 0, y: 0 }, jump: false });
  },
}));
