"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import DynamicSky from "./components/DynamicSky";
import Ocean from "./components/Ocean";
import Player from "./components/Player";
import MobileControls from "./components/MobileControls";

export default function Scene(): JSX.Element {
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
        <DynamicSky />
        <ambientLight intensity={0.5} color={new THREE.Color(0xffcc66)} />
        <pointLight castShadow intensity={0.5} position={[10, 10, 10]} color={new THREE.Color(0xffaa33)} />
        <Physics gravity={[0, 0, 0]}>
          <Ocean />
          <Player />
        </Physics>
        <PointerLockControls />
      </Canvas>
      <MobileControls />
    </div>
  );
}


