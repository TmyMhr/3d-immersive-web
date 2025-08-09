"use client";
import React, { useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface IslandProps {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  hasRocks?: boolean;
  hasTrees?: boolean;
  islandType?: 'tropical' | 'rocky' | 'grassy' | 'desert';
}

export default function Island({ 
  position, 
  size = [20, 2, 20], 
  color = "#8B7355",
  hasRocks = true,
  hasTrees = true,
  islandType = 'tropical'
}: IslandProps) {
  
  // Create more natural terrain geometry
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size[0], size[2], 32, 32);
    const vertices = geometry.attributes.position.array as Float32Array;
    
    // Add height variation for natural terrain
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];
      const distance = Math.sqrt(x * x + z * z);
      const maxDistance = Math.max(size[0], size[2]) / 2;
      
      // Create island shape that slopes down toward edges
      let height = 0;
      if (distance < maxDistance * 0.8) {
        height = Math.cos((distance / maxDistance) * Math.PI / 2) * size[1];
        // Add some noise for natural variation
        height += (Math.random() - 0.5) * 0.5;
      }
      
      vertices[i + 2] = height;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2); // Rotate to be horizontal
    
    return geometry;
  }, [size]);

  // Physics collision for the island
  const [ref] = useBox(() => ({
    position: [position[0], position[1] - size[1] / 2, position[2]],
    args: size,
    type: 'Static',
    material: { friction: 0.8 }
  }));

  // Load textures at top level
  const [grass, dirt] = useTexture(['/assets/grass.jpg', '/assets/dirt.jpg']);
  
  // Configure texture tiling
  useMemo(() => {
    if (grass && dirt) {
      grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
      grass.repeat.set(6, 6);
      dirt.wrapS = dirt.wrapT = THREE.RepeatWrapping;
      dirt.repeat.set(4, 4);
    }
  }, [grass, dirt]);
  
  const textures = { grass, dirt };

  // Get colors and materials based on island type
  const islandMaterial = useMemo(() => {
    const baseColors = {
      tropical: "#7B8B3A",
      rocky: "#8B7355", 
      grassy: "#6B7B2A",
      desert: "#C4A484"
    };
    
    return {
      color: baseColors[islandType] || color,
      roughness: islandType === 'rocky' ? 0.9 : 0.7,
      metalness: 0.1
    };
  }, [islandType, color]);

  // Generate natural rock formations
  const generateRocks = () => {
    if (!hasRocks) return null;
    
    const rocks = [];
    const numRocks = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numRocks; i++) {
      const rockSize = 0.5 + Math.random() * 1.5;
      const angle = (i / numRocks) * Math.PI * 2 + Math.random() * 0.5;
      const distance = (Math.random() * size[0] * 0.3);
      
      const rockX = Math.cos(angle) * distance;
      const rockZ = Math.sin(angle) * distance;
      const rockY = size[1] * 0.3 + rockSize * 0.5;
      
      rocks.push(
        <mesh 
          key={i}
          position={[rockX, rockY, rockZ]} 
          castShadow 
          receiveShadow
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
        >
          <dodecahedronGeometry args={[rockSize]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.1, 0.2, 0.3 + Math.random() * 0.2)}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      );
    }
    return rocks;
  };

  // Generate simple vegetation
  const generateTrees = () => {
    if (!hasTrees || islandType === 'rocky' || islandType === 'desert') return null;
    
    const trees = [];
    const numTrees = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numTrees; i++) {
      const angle = (i / numTrees) * Math.PI * 2 + Math.random() * 1;
      const distance = Math.random() * size[0] * 0.25;
      
      const treeX = Math.cos(angle) * distance;
      const treeZ = Math.sin(angle) * distance;
      const treeY = size[1] * 0.5;
      
      const trunkHeight = 1.5 + Math.random() * 1;
      const crownSize = 0.8 + Math.random() * 0.4;
      
      trees.push(
        <group key={i} position={[treeX, treeY, treeZ]}>
          {/* Tree trunk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.2, trunkHeight]} />
            <meshStandardMaterial color="#4A3728" roughness={0.8} />
          </mesh>
          {/* Tree crown */}
          <mesh position={[0, trunkHeight * 0.7, 0]} castShadow>
            <sphereGeometry args={[crownSize, 8, 6]} />
            <meshStandardMaterial 
              color={islandType === 'tropical' ? "#2D5016" : "#4A6741"} 
              roughness={0.7}
            />
          </mesh>
        </group>
      );
    }
    return trees;
  };

  return (
    <group position={position}>
      {/* Main island terrain */}
      <mesh receiveShadow castShadow>
        <primitive object={terrainGeometry} />
        <meshStandardMaterial 
          map={textures.grass}
          normalMap={textures.dirt}
          color={islandMaterial.color}
          roughness={islandMaterial.roughness}
          metalness={islandMaterial.metalness}
        />
      </mesh>
      
      {/* Physics collision box (invisible) */}
      <mesh ref={ref as any} visible={false}>
        <boxGeometry args={size} />
      </mesh>
      
      {/* Natural rock formations */}
      {generateRocks()}
      
      {/* Simple vegetation */}
      {generateTrees()}
      
      {/* Beach sand ring for tropical islands */}
      {islandType === 'tropical' && (
        <mesh position={[0, -size[1] * 0.4, 0]} receiveShadow>
          <ringGeometry args={[size[0] * 0.6, size[0] * 0.8, 16]} />
          <meshStandardMaterial 
            color="#F4E4BC" 
            roughness={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

