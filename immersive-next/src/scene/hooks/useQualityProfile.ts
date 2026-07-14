"use client";
import { useMemo } from "react";
import { useTouchDevice } from "./useTouchDevice";

export type QualityProfile = {
  isMobile: boolean;
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  antialias: boolean;
  oceanSize: number;
  oceanSegments: number;
  waterTextureSize: number;
  showStats: boolean;
};

export function useQualityProfile(): QualityProfile {
  const isMobile = useTouchDevice();

  return useMemo(
    () =>
      isMobile
        ? {
            isMobile: true,
            dpr: [0.75, 1.25],
            shadows: false,
            shadowMapSize: 512,
            antialias: false,
            oceanSize: 2048,
            oceanSegments: 32,
            waterTextureSize: 512,
            showStats: false,
          }
        : {
            isMobile: false,
            dpr: [1, 1.75],
            shadows: true,
            shadowMapSize: 1024,
            antialias: true,
            oceanSize: 10000,
            oceanSegments: 64,
            waterTextureSize: 1024,
            showStats: process.env.NODE_ENV === "development",
          },
    [isMobile]
  );
}
