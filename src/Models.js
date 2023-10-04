import React from 'react';
import Model from './Model'; // Import your Model component
import { generateRandomPosition, generateRandomRotationY } from './helpers'; // Import your helper functions

function Models({ numModels, minPosition, maxPosition, baseY }) {
  // Generate random positions and rotations for the models
  const randomPositions = Array.from({ length: numModels }, () =>
    generateRandomPosition(minPosition, maxPosition, baseY)
  );

  const randomRotations = Array.from({ length: numModels }, () =>
    generateRandomRotationY()
  );

  return (
    <>
      {randomPositions.map((position, index) => (
        <Model key={index} position={position} rotation={randomRotations[index]} />
      ))}
    </>
  );
}

export default Models;
