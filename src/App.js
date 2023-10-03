import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, PointerLockControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Model from "./Model" // Import the Model component as a named import
import { Player } from './Player';
import { Ground } from './Ground';
import { Cubes } from './Cube';
import { UserInterFaceTest } from './userInterfaceTest';




function generateRandomPosition(min, max, baseY) {
  const x = Math.random() * (max - min) + min;
  const z = Math.random() * (max - min) + min;
  return [x, baseY, z];
}



export default function App() {

  const numModels = 10; // Adjust the number of models you want to spawn
  const minPosition = -10; // Adjust the minimum position for randomization
  const maxPosition = 10; // Adjust the maximum position for randomization
  const baseY = 0; // Adjust the desired base Y coordinate


  const randomPositions = Array.from({ length: numModels }, () =>
    generateRandomPosition(minPosition, maxPosition, baseY)
  );

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
        {randomPositions.map((position, index) => (
        <Model key={index} position={position} />
      ))}
        <UserInterFaceTest />
        <Cubes />
        {/* Add the ModelViewer component here */}

      </Physics>
      <PointerLockControls />
    </Canvas>
  );
}
