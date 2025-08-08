"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";

const MOVE_SPEED = 5;
const keys: Record<string, "forward" | "backward" | "left" | "right" | "jump"> = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};

const moveFieldByKey = (key: string) => keys[key];
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true } as any));
    const handleKeyUp = (e: KeyboardEvent) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false } as any));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return movement;
}

export default function Player(): JSX.Element {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 2, 0],
    args: [0.5],
  }));

  const { forward, backward, left, right, jump } = usePlayerControls() as any;
  const { camera } = useThree();
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const position = useRef<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    // @ts-ignore
    api.velocity.subscribe((v: [number, number, number]) => (velocity.current = v));
    // @ts-ignore
    api.position.subscribe((p: [number, number, number]) => (position.current = p));
  }, [api]);

  useFrame(() => {
    const [x, y, z] = position.current;
    camera.position.set(x, y + 1.5, z);

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(camera.rotation);
    // Lock Y velocity to 0 to avoid falling without a ground plane
    // @ts-ignore
    api.velocity.set(direction.x, 0, direction.z);
  });

  return (
    <mesh ref={ref as any} castShadow>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}


