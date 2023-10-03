import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, PointerLockControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Ground } from './Ground';
import { Player } from './Player';
import Model from "./Model" // Import the Model component as a named import
import { Cubes } from './Cube';
import { UserInterFaceTest } from './userInterfaceTest';

export default function App() {
  return (
    <Canvas shadows gl={{ alpha: false }} camera={{ fov: 45 }}>
      <Stats />
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars />
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Ground />
        <Player />
        <Model />
        <UserInterFaceTest />
        <Cubes />
        {/* Add the ModelViewer component here */}

      </Physics>
      <PointerLockControls />
    </Canvas>
  );
}
