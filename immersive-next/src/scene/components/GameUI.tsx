"use client";
import React from "react";
import { Html } from "@react-three/drei";

interface GameUIProps {
  score: number;
  totalCollectibles: number;
  objective?: string;
}

export default function GameUI({ score, totalCollectibles, objective }: GameUIProps) {
  return (
    <Html fullscreen zIndexRange={[1, 100]}>
      <div className="absolute top-4 left-4 text-white z-10 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
        <div className="space-y-2">
          <div className="text-xl font-bold">Crystals: {score}/{totalCollectibles}</div>
          {objective && <div className="text-sm opacity-80">{objective}</div>}
          {score === totalCollectibles && score > 0 && (
            <div className="text-green-400 font-bold animate-pulse">🎉 All crystals found! 🎉</div>
          )}
        </div>
      </div>
    </Html>
  );
}

