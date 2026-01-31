"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { useInputStore } from "../store/input";

const MOVE_SPEED = 6;
const ACCEL = 20;
const JUMP_FORCE = 4;

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

export default function Player(): React.ReactElement {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 5, 0], // Start higher up
    args: [0.8], // Slightly larger collision sphere
    fixedRotation: true, // Prevent player from rolling
    linearDamping: 0.1,
  }));

  const { forward, backward, left, right, jump } = usePlayerControls() as any;
  const mobileMove = useInputStore((s) => s.move);
  const mobileJump = useInputStore((s) => s.jump);
  const { camera } = useThree();
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const position = useRef<[number, number, number]>([0, 0, 0]);
  const prevJumpDown = useRef(false);

  useEffect(() => {
    // @ts-ignore
    api.velocity.subscribe((v: [number, number, number]) => (velocity.current = v));
    // @ts-ignore
    api.position.subscribe((p: [number, number, number]) => (position.current = p));
  }, [api]);

  const currentVelocity = new THREE.Vector3();

  useFrame((_, dt) => {
    const [x, y, z] = position.current;
    const fwd = forward || mobileMove.y > 0.25;
    const back = backward || mobileMove.y < -0.25;
    const lft = left || mobileMove.x < -0.25;
    const rgt = right || mobileMove.x > 0.25;
    const wantJump = jump || mobileJump;

    // Camera follows player
    camera.position.set(x, y + 1.8, z); // Adjust camera height

    // Calculate movement direction
    const front = new THREE.Vector3(0, 0, 0);
    const rightV = new THREE.Vector3(0, 0, 0);
    const moveDir = new THREE.Vector3(0, 0, 0);

    // Get camera forward direction projected on XZ plane
    front.set(0, 0, -1).applyQuaternion(camera.quaternion);
    front.y = 0;
    front.normalize();

    // Get camera right direction projected on XZ plane
    rightV.set(1, 0, 0).applyQuaternion(camera.quaternion);
    rightV.y = 0;
    rightV.normalize();

    // Combine inputs
    if (fwd) moveDir.add(front);
    if (back) moveDir.sub(front);
    if (rgt) moveDir.add(rightV);
    if (lft) moveDir.sub(rightV);
    
    moveDir.normalize();

    // Apply movement
    currentVelocity.set(velocity.current[0], velocity.current[1], velocity.current[2]);
    
    // Underwater logic
    const isUnderwater = y < -0.5; // Slightly below surface
    const speed = isUnderwater ? MOVE_SPEED * 0.5 : MOVE_SPEED;
    
    const target = moveDir.multiplyScalar(speed);
    
    // Apply damping for smooth movement
    const vx = THREE.MathUtils.damp(currentVelocity.x, target.x, ACCEL, dt);
    const vz = THREE.MathUtils.damp(currentVelocity.z, target.z, ACCEL, dt);
    
    // Jump logic (Real physics)
    let vy = velocity.current[1];
    
    // Simple ground check based on velocity
    // This is a heuristic; for production you'd use a raycast
    const isGrounded = Math.abs(vy) < 0.1;
    
    if (wantJump && !prevJumpDown.current) {
      if (isGrounded || isUnderwater) {
        vy = JUMP_FORCE; // Apply instant upward velocity
      }
    }
    prevJumpDown.current = !!wantJump;
    
    // Apply velocity
    // We must pass current Y velocity to let gravity work
    api.velocity.set(vx, vy, vz);
  });

  return (
    <group ref={ref as any}>
      {/* Player body - capsule-like shape */}
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      {/* Player head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      {/* Simple eyes */}
      <mesh position={[-0.1, 0.9, 0.25]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.1, 0.9, 0.25]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}
