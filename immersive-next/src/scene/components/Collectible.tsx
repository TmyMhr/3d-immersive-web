"use client";
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import * as THREE from "three";

interface CollectibleProps {
  position: [number, number, number];
  onCollect?: () => void;
  color?: string;
  size?: number;
}

export default function Collectible({
  position,
  onCollect,
  color = "#00ffff",
  size = 0.5,
}: CollectibleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  // Physics body for collision detection (static collider)
  const [ref] = useSphere(() => ({
    position,
    args: [size],
    type: "Static",
  }));

  // Floating animation
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.rotation.y += 0.02;
    }
  });

  // Handle collection on click (simple interaction)
  const handleCollect = () => {
    if (!collected) {
      setCollected(true);
      onCollect?.();
    }
  };

  if (collected) return null;

  return (
    <group ref={ref as any}>
      <mesh ref={meshRef} castShadow onClick={handleCollect}>
        <octahedronGeometry args={[size]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight color={color} intensity={0.5} distance={3} position={[0, 0, 0]} />
    </group>
  );
}
