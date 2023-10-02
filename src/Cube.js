import * as THREE from "three";
import { useCallback, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import create from "zustand";
import dirt from "./assets/dirt.jpg";

const useCubeStore = create((set) => ({
  cubes: [],
  addCube: (x, y, z) => set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}));

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((coords, index) => <Cube key={index} position={coords} />);
};

export const Cube = (props) => {
  const [ref] = useBox(() => ({
    type: "Static", // Change to "Dynamic" for physics
    position: props.position,
    scale: [10, 10, 10], // Make the cube larger (adjust the numbers as needed)
    mass: 20.0, // Increase the mass for more realistic physics
    ...props,
  }));

  const [hover, set] = useState(null);
  const addCube = useCubeStore((state) => state.addCube);
  const texture = useLoader(THREE.TextureLoader, dirt);

  const onMove = useCallback((e) => (e.stopPropagation(), set(Math.floor(e.faceIndex / 2))), []);
  const onOut = useCallback(() => set(null), []);

  const onClick = useCallback((e) => {
    e.stopPropagation();
    const { x, y, z } = ref.current.position;
    const dir = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];
    addCube(...dir[Math.floor(e.faceIndex / 2)]);
  }, []);

  return (
    <mesh ref={ref} receiveShadow castShadow onPointerMove={onMove} onPointerOut={onOut} onClick={onClick}>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial attachArray="material" key={index} map={texture} color={hover === index ? "hotpink" : "white"} />
      ))}
      <boxGeometry />
    </mesh>
  );
};
