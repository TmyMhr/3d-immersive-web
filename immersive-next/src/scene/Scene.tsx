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
import { DeviceProvider, useDevice, type QualityProfile } from "./context/DeviceContext";

const LIGHT_COLORS = {
  ambient: 0xfff0cc,
  hemiSky: 0xb1e1ff,
  hemiGround: 0xb97a20,
  sun: 0xffffff,
  fog: 0xdfefff,
} as const;

function SceneContent({
  sunPosition,
  azimuth,
  quality,
}: {
  sunPosition: [number, number, number];
  azimuth: number;
  quality: QualityProfile;
}) {
  return (
    <>
      {quality.showStats && <Stats />}
      <DynamicSky sunPosition={sunPosition} azimuth={azimuth} distance={quality.skyDistance} />
      <ambientLight intensity={0.5} color={LIGHT_COLORS.ambient} />
      <hemisphereLight
        color={LIGHT_COLORS.hemiSky}
        groundColor={LIGHT_COLORS.hemiGround}
        intensity={0.6}
      />
      <directionalLight
        castShadow={quality.shadows}
        intensity={1.4}
        color={LIGHT_COLORS.sun}
        position={sunPosition}
        shadow-mapSize-width={quality.shadowMapSize}
        shadow-mapSize-height={quality.shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <Physics gravity={[0, -9.82, 0]} allowSleep>
        <Ocean sunPosition={sunPosition} quality={quality} />
        <SeaFloor castShadow={quality.shadows} />
        <IslandWorld castShadow={quality.shadows} />
        <Player />
      </Physics>
    </>
  );
}

function SceneCanvas() {
  const [timeOfDay] = useState(0.25);
  const { isTouch, quality } = useDevice();

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
          scene.fog = new THREE.Fog(LIGHT_COLORS.fog, 20, quality.isMobile ? 1200 : 2000);
          scene.background = new THREE.Color(LIGHT_COLORS.fog);
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

export default function Scene(): React.ReactElement {
  return (
    <DeviceProvider>
      <SceneCanvas />
    </DeviceProvider>
  );
}
