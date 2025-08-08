"use client";
import React from "react";
import { usePlane } from "@react-three/cannon";

export default function Ground(): JSX.Element {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }));
  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#3a5f3a" />
    </mesh>
  );
}


