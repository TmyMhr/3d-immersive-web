"use client";
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface RockProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  rotation?: [number, number, number];
}

export default function Rock({ 
  position, 
  size = 1, 
  color,
  rotation = [0, 0, 0]
}: RockProps) {
  
  // Use a default color if none provided, with some variation if it was generated
  const rockColor = useMemo(() => {
    if (color) return color;
    return new THREE.Color().setHSL(0.1, 0.2, 0.3 + Math.random() * 0.2);
  }, [color]);

  return (
    <mesh 
      position={position} 
      rotation={rotation}
      castShadow 
      receiveShadow
    >
      <dodecahedronGeometry args={[size]} />
      <meshStandardMaterial 
        color={rockColor}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
