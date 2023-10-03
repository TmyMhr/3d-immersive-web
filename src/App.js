import * as THREE from "three";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Model from './Model'; // Import the Model component as a named import
import { Player } from './Player';
import { Ground } from './Ground';
import { Cubes } from './Cube';
import { UserInterFaceTest } from './userInterfaceTest';

function generateRandomPosition(min, max, baseY) {
  const x = Math.random() * (max - min) + min;
  const z = Math.random() * (max - min) + min;
  return [x, baseY, z];
}

function generateRandomRotationY() {
  const randomRotationY = (Math.random() - 0.5) * Math.PI * 2; // Random rotation around Y axis
  return [0, randomRotationY, 0]; // Only rotate around Y-axis
}

export default function App() {
  const numModels = 10; // Adjust the number of models you want to spawn
  const minPosition = -10; // Adjust the minimum position for randomization
  const maxPosition = 10; // Adjust the maximum position for randomization
  const baseY = 0; // Adjust the desired base Y coordinate

  const randomPositions = Array.from({ length: numModels }, () =>
    generateRandomPosition(minPosition, maxPosition, baseY)
  );

  const randomRotations = Array.from({ length: numModels }, () =>
    generateRandomRotationY()
  );

  return (
    <Canvas shadows gl={{ alpha: false }} camera={{ fov: 45 }}>
      <Stats />
      <Sky
  distance={450000}
  sunPosition={[0, 0.3, 0]} // Lower Y-coordinate for a setting sun
  inclination={0.2}          // Lower inclination for a setting sun
  azimuth={0.8}           // Adjust horizontal position
/>
 
<ambientLight intensity={0.5} color={new THREE.Color(0xffcc66)} /> {/* Warm yellow color */}
      
      {/* Point Light */}
      <pointLight
        castShadow
        intensity={0.5}
        position={[10, 10, 10]} // Adjust position as needed
        color={new THREE.Color(0xffaa33)} // Warm orange color
      />
      <Physics gravity={[0, -30, 0]}>
        <Ground />
        <Player />
        {Array.from({ length: numModels }).map((_, index) => (
          <Model key={index} position={randomPositions[index]} rotation={randomRotations[index]} />
        ))}
        <UserInterFaceTest />
        <Cubes />
        {/* Add the ModelViewer component here */}
      </Physics>
      <PointerLockControls />
    </Canvas>
  );
}
