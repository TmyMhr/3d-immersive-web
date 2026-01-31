"use client";
import React, { useMemo } from 'react';
import { useTrimesh } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Rock from './Rock';
import Tree from './Tree';

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
  const [ref] = useTrimesh(() => {
    const vertices = terrainGeometry.attributes.position.array;
    const indices = terrainGeometry.index ? terrainGeometry.index.array : Object.keys(vertices).map(Number);
    
    return {
      args: [vertices as Float32Array, indices as Float32Array],
      position: position, // No need to offset Y for trimesh as it matches geometry exactly
      type: 'Static',
      material: { friction: 0.8 }
    };
  }, [terrainGeometry, position]);

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
  const rocks = useMemo(() => {
    if (!hasRocks) return [];
    
    const items = [];
    const numRocks = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numRocks; i++) {
      const rockSize = 0.5 + Math.random() * 1.5;
      const angle = (i / numRocks) * Math.PI * 2 + Math.random() * 0.5;
      const distance = (Math.random() * size[0] * 0.3);
      
      const rockX = Math.cos(angle) * distance;
      const rockZ = Math.sin(angle) * distance;
      const rockY = size[1] * 0.3 + rockSize * 0.5;
      
      items.push({
        position: [rockX, rockY, rockZ] as [number, number, number],
        size: rockSize,
        rotation: [Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3] as [number, number, number]
      });
    }
    return items;
  }, [hasRocks, size]);

  // Generate simple vegetation
  const trees = useMemo(() => {
    if (!hasTrees || islandType === 'rocky' || islandType === 'desert') return [];
    
    const items = [];
    const numTrees = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numTrees; i++) {
      const angle = (i / numTrees) * Math.PI * 2 + Math.random() * 1;
      const distance = Math.random() * size[0] * 0.25;
      
      const treeX = Math.cos(angle) * distance;
      const treeZ = Math.sin(angle) * distance;
      const treeY = size[1] * 0.5;
      
      const trunkHeight = 1.5 + Math.random() * 1;
      const crownSize = 0.8 + Math.random() * 0.4;
      
      items.push({
        position: [treeX, treeY, treeZ] as [number, number, number],
        trunkHeight,
        crownSize
      });
    }
    return items;
  }, [hasTrees, islandType, size]);

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
      <mesh visible={false}>
        {/* Visual representation handled by useTrimesh ref attachment to group or separate mesh */}
      </mesh>
      
      {/* Natural rock formations */}
      {rocks.map((rock, i) => (
        <Rock 
          key={i}
          position={rock.position}
          size={rock.size}
          rotation={rock.rotation}
        />
      ))}
      
      {/* Simple vegetation */}
      {trees.map((tree, i) => (
        <Tree 
          key={i}
          position={tree.position}
          trunkHeight={tree.trunkHeight}
          crownSize={tree.crownSize}
          type={islandType === 'tropical' ? 'tropical' : 'temperate'}
        />
      ))}
      
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

