import React from 'react';
import { Cloud } from '@react-three/drei';

function SkyClouds() {
  return (
    <>
      <Cloud segments={40} bounds={[10, 2, 2]} volume={10} color="orange" position={[0, 60, 0]} />
      <Cloud seed={1} scale={2} volume={5} color="hotpink" fade={100} position={[0, 55, 0]} />
      {/* Your component content goes here */}
    </>
  );
}

export default SkyClouds;