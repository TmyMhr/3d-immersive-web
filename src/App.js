import * as THREE from "three";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';

import { Player } from './Player';
import { Ground } from './Ground';
import { Cubes } from './Cube';
import Ocean  from "./Ocean"


export default function App() {


  return (
    <Canvas 
    shadows
    gl={{ alpha: false, antialias: true }}
    camera={{ fov: 45 }}
    gammaFactor={2.2}
    shadowBias={-0.001}
    colorManagement={true}
    fog={new THREE.Fog(0xcce0ff, 10, 1000)}
    physicallyCorrectLights={true}
    concurrent={true}
    sRGB={true}
    onCreated={(state) => {
      // Custom initialization code
    }}>
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
      <Physics gravity={[0, -0.1, 0]}>
     <Ocean />
        <Ground />
        <Player />

        <Cubes />
        {/* Add the ModelViewer component here */}
      </Physics>
      <PointerLockControls />
    </Canvas>
  );
}


