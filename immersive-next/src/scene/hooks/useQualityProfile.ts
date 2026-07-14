"use client";
import { useDevice, type QualityProfile } from "../context/DeviceContext";

export type { QualityProfile };

export function useQualityProfile(): QualityProfile {
  return useDevice().quality;
}
