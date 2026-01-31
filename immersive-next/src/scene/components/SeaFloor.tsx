"use client";
import React from "react";
import { usePlane } from "@react-three/cannon";

export default function SeaFloor(): JSX.Element {
  // A static plane deep underwater to catch the player
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -30, 0], // 30 units deep
    type: "Static",
    material: { friction: 1 }
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#001e0f" roughness={1} />
    </mesh>
  );
}
