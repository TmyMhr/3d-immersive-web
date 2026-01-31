"use client";
import React, { useState } from 'react';
import Island from './Island';
import Collectible from './Collectible';
import GameUI from './GameUI';
import { islands, collectibles } from '../../data/worldConfig';

export default function IslandWorld() {
  const [score, setScore] = useState(0);
  const totalCollectibles = collectibles.length;

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
      
      {islands.map((island) => (
        <Island 
          key={island.id}
          position={island.position} 
          size={island.size}
          islandType={island.type}
          hasTrees={island.hasTrees}
          hasRocks={island.hasRocks}
        />
      ))}
      
      {collectibles.map((collectible) => (
        <Collectible 
          key={collectible.id}
          position={collectible.position} 
          onCollect={handleCollect}
          color={collectible.color}
          size={collectible.size}
        />
      ))}
    </>
  );
}
