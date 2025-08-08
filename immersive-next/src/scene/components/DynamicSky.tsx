"use client";
import React, { useState, useEffect } from "react";
import { Sky } from "@react-three/drei";

export default function DynamicSky(): JSX.Element {
  const [timeOfDay, setTimeOfDay] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOfDay((prev) => (prev + 0.01) % 1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Make sun move in a larger, warmer arc similar to your original
  const angle = timeOfDay * Math.PI * 2;
  const sunPosition: [number, number, number] = [
    Math.cos(angle) * 100,
    Math.sin(angle) * 50 + 10,
    0,
  ];

  return <Sky distance={450000} sunPosition={sunPosition} azimuth={0.25 + timeOfDay * 0.5} />;
}


