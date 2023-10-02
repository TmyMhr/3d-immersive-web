import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useTerrain } from "@react-three/drei";
import heightmap from "./assets/heightmap-test.png"; // Replace with your heightmap image

export const Ground = (props) => {
  const [ref] = useTerrain(() => ({
    width: 1000, // Adjust the width of your terrain
    height: 1000, // Adjust the height of your terrain
    widthSegments: 100, // Adjust the number of segments
    heightSegments: 100, // Adjust the number of segments
    ...props,
  }));

  const texture = useLoader(THREE.TextureLoader, heightmap);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000, 100, 100]} />
      <meshStandardMaterial map={texture} map-repeat={[10, 10]} color="white" />
    </mesh>
  );
};