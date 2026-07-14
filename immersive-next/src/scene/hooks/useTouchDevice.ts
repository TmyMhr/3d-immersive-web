"use client";
import { useDevice } from "../context/DeviceContext";

export function useTouchDevice(): boolean {
  return useDevice().isTouch;
}
