"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type QualityProfile = {
  isMobile: boolean;
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  antialias: boolean;
  oceanSize: number;
  oceanSegments: number;
  waterTextureSize: number;
  skyDistance: number;
  showStats: boolean;
};

export function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0
  );
}

function buildQuality(isMobile: boolean): QualityProfile {
  return isMobile
    ? {
        isMobile: true,
        dpr: [0.75, 1.25],
        shadows: false,
        shadowMapSize: 512,
        antialias: false,
        oceanSize: 2048,
        oceanSegments: 32,
        waterTextureSize: 512,
        skyDistance: 4500,
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
        skyDistance: 450000,
        showStats: process.env.NODE_ENV === "development",
      };
}

type DeviceContextValue = {
  isTouch: boolean;
  quality: QualityProfile;
};

const DeviceContext = createContext<DeviceContextValue>({
  isTouch: false,
  quality: buildQuality(false),
});

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [isTouch, setIsTouch] = useState(detectTouchDevice);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(detectTouchDevice());
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const quality = useMemo(() => buildQuality(isTouch), [isTouch]);

  return (
    <DeviceContext.Provider value={{ isTouch, quality }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  return useContext(DeviceContext);
}
