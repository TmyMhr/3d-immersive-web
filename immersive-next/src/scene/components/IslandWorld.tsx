"use client";
import React, { useState } from 'react';
import Island from './Island';
import Collectible from './Collectible';
import GameUI from './GameUI';

export default function IslandWorld() {
  const [score, setScore] = useState(0);
  const totalCollectibles = 6;

  const handleCollect = () => {
    setScore(prev => prev + 1);
  };

  return (
    <>
      <GameUI 
        score={score}
        totalCollectibles={totalCollectibles}
        objective="Explore the islands and collect all the glowing crystals!"
      />
      
      {/* Main central tropical island */}
      <Island 
        position={[0, 0, 0]} 
        size={[35, 4, 35]}
        islandType="tropical"
        hasTrees={true}
        hasRocks={true}
      />
      
      {/* Rocky mountain island */}
      <Island 
        position={[60, -0.5, 25]} 
        size={[18, 6, 18]}
        islandType="rocky"
        hasTrees={false}
        hasRocks={true}
      />
      
      {/* Grassy meadow island */}
      <Island 
        position={[-45, -1, -35]} 
        size={[25, 3, 15]}
        islandType="grassy"
        hasRocks={false}
        hasTrees={true}
      />
      
      {/* Desert oasis island */}
      <Island 
        position={[30, 0.5, -50]} 
        size={[15, 2.5, 20]}
        islandType="desert"
        hasTrees={false}
        hasRocks={true}
      />
      
      {/* Small tropical atoll */}
      <Island 
        position={[-25, -0.5, 40]} 
        size={[12, 2, 12]}
        islandType="tropical"
        hasTrees={true}
        hasRocks={false}
      />
      
      {/* Collectible crystals - positioned on each island */}
      <Collectible 
        position={[0, 6, 0]} 
        onCollect={handleCollect}
        color="#ff6b6b"
        size={0.6}
      />
      
      <Collectible 
        position={[60, 8, 25]} 
        onCollect={handleCollect}
        color="#4ecdc4"
        size={0.7}
      />
      
      <Collectible 
        position={[-45, 4, -35]} 
        onCollect={handleCollect}
        color="#45b7d1"
        size={0.5}
      />
      
      <Collectible 
        position={[30, 4, -50]} 
        onCollect={handleCollect}
        color="#96ceb4"
        size={0.6}
      />
      
      <Collectible 
        position={[-25, 3, 40]} 
        onCollect={handleCollect}
        color="#feca57"
        size={0.5}
      />
      
      <Collectible 
        position={[15, 5, 15]} 
        onCollect={handleCollect}
        color="#ff9ff3"
        size={0.6}
      />
    </>
  );
}
