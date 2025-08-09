"use client";
import * as THREE from "three";
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import DynamicSky from "./components/DynamicSky";
import Ocean from "./components/Ocean";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";

export default function Scene(): JSX.Element {
  const [timeOfDay, setTimeOfDay] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOfDay((t) => (t + 0.01) % 1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const { sunPosition, azimuth } = useMemo(() => {
    const angle = timeOfDay * Math.PI * 2;
    const pos: [number, number, number] = [
      Math.cos(angle) * 100,
      Math.sin(angle) * 50 + 10,
      0,
    ];
    const az = 0.25 + timeOfDay * 0.5;
    return { sunPosition: pos, azimuth: az };
  }, [timeOfDay]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ alpha: false, antialias: true }}
        camera={{ fov: 45 }}
        fog={new THREE.Fog(0xcce0ff, 10, 1000)}
        onCreated={() => {}}
      >
        <Stats />
        <DynamicSky sunPosition={sunPosition} azimuth={azimuth} />
        <ambientLight intensity={0.2} color={new THREE.Color(0xffcc66)} />
        <directionalLight
          castShadow
          intensity={0.8}
          color={new THREE.Color(0xffeecc)}
          position={sunPosition}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics gravity={[0, 0, 0]}>
          <Ocean sunPosition={sunPosition} />
          <Player />
        </Physics>
        <PointerLockControls />
      </Canvas>
      <MobileControls />
    </div>
  );
}


