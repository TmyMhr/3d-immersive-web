// playerMovement.js
import * as THREE from "three";

export const calculatePlayerVelocity = (forward, backward, left, right, speed) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3(0, 0, backward - forward);
  const sideVector = new THREE.Vector3(left - right, 0, 0);

  direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);

  return direction;
};
