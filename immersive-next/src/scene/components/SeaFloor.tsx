"use client";
import React from "react";
import { usePlane } from "@react-three/cannon";
import * as THREE from "three";

type Props = { castShadow?: boolean };

export default function SeaFloor({ castShadow = true }: Props): React.ReactElement {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -30, 0],
    type: "Static",
    material: { friction: 1 },
  }));

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>} receiveShadow={castShadow}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#001e0f" roughness={1} />
    </mesh>
  );
}
