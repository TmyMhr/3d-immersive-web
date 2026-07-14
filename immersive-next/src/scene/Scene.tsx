"use client";
import * as THREE from "three";
import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import DynamicSky from "./components/DynamicSky";
import Ocean from "./components/Ocean";
import Player from "./components/Player";
import SeaFloor from "./components/SeaFloor";
import MobileControls from "./components/MobileControls";
import IslandWorld from "./components/IslandWorld";
import { useTouchDevice } from "./hooks/useTouchDevice";
import { useQualityProfile } from "./hooks/useQualityProfile";

function SceneContent({
  sunPosition,
  azimuth,
  quality,
}: {
  sunPosition: [number, number, number];
  azimuth: number;
  quality: ReturnType<typeof useQualityProfile>;
}) {
  return (
    <>
      {quality.showStats && <Stats />}
      <DynamicSky sunPosition={sunPosition} azimuth={azimuth} />
      <ambientLight intensity={0.5} color={new THREE.Color(0xfff0cc)} />
      <hemisphereLight
        color={new THREE.Color(0xb1e1ff)}
        groundColor={new THREE.Color(0xb97a20)}
        intensity={0.6}
      />
      <directionalLight
        castShadow={quality.shadows}
        intensity={1.4}
        color={new THREE.Color(0xffffff)}
        position={sunPosition}
        shadow-mapSize-width={quality.shadowMapSize}
        shadow-mapSize-height={quality.shadowMapSize}
      />
      <Physics gravity={[0, -9.82, 0]}>
        <Ocean sunPosition={sunPosition} quality={quality} />
        <SeaFloor castShadow={quality.shadows} />
        <IslandWorld castShadow={quality.shadows} />
        <Player />
      </Physics>
    </>
  );
}

export default function Scene(): React.ReactElement {
  const [timeOfDay] = useState(0.25);
  const isTouch = useTouchDevice();
  const quality = useQualityProfile();

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
    <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      <Canvas
        shadows={quality.shadows}
        dpr={quality.dpr}
        gl={{ alpha: false, antialias: quality.antialias, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 3000 }}
        onCreated={({ gl, scene }) => {
          scene.fog = new THREE.Fog(0xdfefff, 20, quality.isMobile ? 1200 : 2000);
          scene.background = new THREE.Color(0xdfefff);
          gl.toneMappingExposure = 1.2;
        }}
      >
        <SceneContent sunPosition={sunPosition} azimuth={azimuth} quality={quality} />
        {!isTouch && <PointerLockControls />}
      </Canvas>
      <MobileControls />
    </div>
  );
}
