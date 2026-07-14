"use client";
import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useQualityProfile } from "../hooks/useQualityProfile";

const COLLECT_RADIUS = 2.5;

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
  const collectedRef = useRef(false);
  const { camera } = useThree();
  const quality = useQualityProfile();
  const playerPos = useRef(new THREE.Vector3());
  const crystalPos = useRef(new THREE.Vector3(...position));

  const collect = () => {
    if (collectedRef.current) return;
    collectedRef.current = true;
    setCollected(true);
    onCollect?.();
    if (quality.isMobile && navigator.vibrate) navigator.vibrate(30);
  };

  useFrame((state) => {
    if (collectedRef.current) return;

    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.rotation.y += 0.02;
    }

    playerPos.current.set(camera.position.x, camera.position.y - 1.8, camera.position.z);
    if (playerPos.current.distanceTo(crystalPos.current) < COLLECT_RADIUS) {
      collect();
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow={quality.shadows} onClick={collect}>
        <octahedronGeometry args={[size, quality.isMobile ? 0 : 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {!quality.isMobile && (
        <pointLight color={color} intensity={0.5} distance={3} position={[0, 0, 0]} />
      )}
    </group>
  );
}
