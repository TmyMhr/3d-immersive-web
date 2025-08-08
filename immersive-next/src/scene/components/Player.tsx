"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { useInputStore } from "../store/input";

const MOVE_SPEED = 6;
const ACCEL = 20;
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
  const mobileMove = useInputStore((s) => s.move);
  const mobileJump = useInputStore((s) => s.jump);
  const { camera } = useThree();
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const position = useRef<[number, number, number]>([0, 0, 0]);
  const jumpOffset = useRef(0);
  const jumpVel = useRef(0);
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
    // Simple jump arc on the camera without changing body Y
    const t = 0.25;
    const fwd = forward || mobileMove.y > t;
    const back = backward || mobileMove.y < -t;
    const lft = left || mobileMove.x < -t;
    const rgt = right || mobileMove.x > t;
    const wantJump = jump || mobileJump;

    const onGround = jumpOffset.current <= 0.0001;
    if (wantJump && !prevJumpDown.current && onGround) {
      jumpVel.current = 3.5; // jump impulse
    }
    prevJumpDown.current = !!wantJump;

    // Gravity integration for the jump offset
    if (!onGround || jumpVel.current > 0) {
      jumpVel.current -= 9.8 * dt;
      jumpOffset.current += jumpVel.current * dt;
      if (jumpOffset.current < 0) {
        jumpOffset.current = 0;
        jumpVel.current = 0;
      }
    }

    camera.position.set(x, y + 1.5 + jumpOffset.current, z);

    frontVector.set(0, 0, Number(back) - Number(fwd));
    sideVector.set(Number(lft) - Number(rgt), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().applyEuler(camera.rotation);

    // Use subscribed velocity from effect
    currentVelocity.set(velocity.current[0], velocity.current[1], velocity.current[2]);
    const target = direction.multiplyScalar(MOVE_SPEED);
    const vx = THREE.MathUtils.damp(currentVelocity.x, target.x, ACCEL, dt);
    const vz = THREE.MathUtils.damp(currentVelocity.z, target.z, ACCEL, dt);
    // @ts-ignore
    api.velocity.set(vx, 0, vz);
  });

  return (
    <mesh ref={ref as any} castShadow>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}


