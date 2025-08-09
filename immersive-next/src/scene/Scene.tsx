"use client";
import * as THREE from "three";
import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import DynamicSky from "./components/DynamicSky";
import Ocean from "./components/Ocean";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";
import IslandWorld from "./components/IslandWorld";

export default function Scene(): React.ReactElement {
  // Lock to daytime (midday)
  const [timeOfDay] = useState(0.25);

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
        onCreated={({ gl, scene }) => {
          scene.fog = new THREE.Fog(0xdfefff, 20, 2000);
          scene.background = new THREE.Color(0xdfefff);
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Stats />
        <DynamicSky sunPosition={sunPosition} azimuth={azimuth} />
        <ambientLight intensity={0.5} color={new THREE.Color(0xfff0cc)} />
        <hemisphereLight color={new THREE.Color(0xb1e1ff)} groundColor={new THREE.Color(0xb97a20)} intensity={0.6} />
        <directionalLight
          castShadow
          intensity={1.4}
          color={new THREE.Color(0xffffff)}
          position={sunPosition}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics gravity={[0, -9.82, 0]}>
          <Ocean sunPosition={sunPosition} />
          <IslandWorld />
          <Player />
        </Physics>
        <PointerLockControls />
      </Canvas>
      <MobileControls />
    </div>
  );
}


