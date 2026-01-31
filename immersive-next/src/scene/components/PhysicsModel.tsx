"use client";
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useTrimesh } from '@react-three/cannon';
import * as THREE from 'three';

interface PhysicsModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  debug?: boolean;
}

function MeshCollider({ 
  mesh, 
  position, 
  rotation, 
  scale 
}: { 
  mesh: THREE.Mesh, 
  position: [number, number, number], 
  rotation: [number, number, number], 
  scale: [number, number, number] 
}) {
  const geometry = mesh.geometry;
  
  const { vertices, indices } = useMemo(() => {
    // Ensure we have an index
    const geo = geometry.clone();
    
    // If geometry doesn't have an index, create one (naive)
    // or useTrimesh might handle non-indexed? usually expects indexed.
    // Ideally we should merge vertices, but for now assuming valid GLTF.
    
    return {
      vertices: geo.attributes.position.array as Float32Array,
      indices: geo.index ? geo.index.array as Float32Array : new Float32Array(Object.keys(geo.attributes.position.array).map(Number))
    };
  }, [geometry]);

  useTrimesh(() => ({
    args: [vertices, indices],
    mass: 0, // Static
    type: 'Static',
    position: position,
    rotation: rotation,
    scale: scale,
  }));

  return null;
}

export default function PhysicsModel({ 
  url, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1,
  debug = false 
}: PhysicsModelProps) {
  const { scene } = useGLTF(url);
  
  // Clone the scene to ensure we have a fresh instance that we can transform
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Apply world transforms to the cloned scene root
  useMemo(() => {
    if (position) clonedScene.position.set(...position);
    if (rotation) clonedScene.rotation.set(...rotation);
    if (scale) {
        const s = Array.isArray(scale) ? scale : [scale, scale, scale];
        clonedScene.scale.set(s[0], s[1], s[2]);
    }
    clonedScene.updateMatrixWorld(true);
  }, [clonedScene, position, rotation, scale]);

  // Extract meshes and calculate their WORLD transforms
  const meshes = useMemo(() => {
    const items: { mesh: THREE.Mesh, worldPos: THREE.Vector3, worldRot: THREE.Euler, worldScale: THREE.Vector3 }[] = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const mesh = child as THREE.Mesh;
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();
        
        mesh.getWorldPosition(worldPos);
        mesh.getWorldQuaternion(worldQuat);
        mesh.getWorldScale(worldScale);
        
        const worldRot = new THREE.Euler().setFromQuaternion(worldQuat);
        
        items.push({ mesh, worldPos, worldRot, worldScale });
      }
    });
    return items;
  }, [clonedScene]);

  return (
    <group>
      {/* Visual Model - rendered via primitive. 
          Note: we don't wrap in a group with transforms because clonedScene already has them applied.
      */}
      <primitive object={clonedScene} />
      
      {/* Physics Bodies - using calculated world transforms */}
      {meshes.map((item) => (
        <MeshCollider 
          key={item.mesh.uuid} 
          mesh={item.mesh} 
          position={[item.worldPos.x, item.worldPos.y, item.worldPos.z]}
          rotation={[item.worldRot.x, item.worldRot.y, item.worldRot.z]}
          scale={[item.worldScale.x, item.worldScale.y, item.worldScale.z]}
        />
      ))}
    </group>
  );
}
