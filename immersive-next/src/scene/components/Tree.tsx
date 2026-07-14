"use client";
import React from 'react';

interface TreeProps {
  position: [number, number, number];
  trunkHeight?: number;
  crownSize?: number;
  type?: 'tropical' | 'temperate';
  castShadow?: boolean;
}

export default function Tree({
  position,
  trunkHeight = 2,
  crownSize = 1,
  type = 'tropical',
  castShadow = true,
}: TreeProps) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh castShadow={castShadow}>
        <cylinderGeometry args={[0.15, 0.2, trunkHeight]} />
        <meshStandardMaterial color="#4A3728" roughness={0.8} />
      </mesh>
      {/* Tree crown */}
      <mesh position={[0, trunkHeight * 0.7, 0]} castShadow={castShadow}>
        <sphereGeometry args={[crownSize, 8, 6]} />
        <meshStandardMaterial 
          color={type === 'tropical' ? "#2D5016" : "#4A6741"} 
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}
