
import React, { useState, useEffect } from 'react';
import { Sky } from '@react-three/drei';

function DynamicSky() {
  const [timeOfDay, setTimeOfDay] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Update timeOfDay in a way that simulates day-to-night transition
      setTimeOfDay((prevTimeOfDay) => (prevTimeOfDay + 0.01) % 1);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const sunPosition = [Math.cos(timeOfDay * Math.PI * 2), Math.sin(timeOfDay * Math.PI * 2), 0];

  return (
    <mesh>
    <Sky
      distance={450000}
      sunPosition={sunPosition}
     // Adjust inclination for day-to-night effect
      azimuth={0.25 + timeOfDay * 0.5} // Adjust azimuth for day-to-night effect
    />
    </mesh>
  );
}

export default DynamicSky;
 