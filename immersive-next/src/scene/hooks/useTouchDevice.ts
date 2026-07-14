"use client";
import { useEffect, useState } from "react";

export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const touchPoints = navigator.maxTouchPoints > 0;
    setIsTouch(coarse || touchPoints);

    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = () => setIsTouch(mq.matches || navigator.maxTouchPoints > 0);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
