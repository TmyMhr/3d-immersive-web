"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { useInputStore } from "../store/input";
import { useTouchDevice } from "../hooks/useTouchDevice";
import { useQualityProfile } from "../hooks/useQualityProfile";

const MOVE_SPEED = 6;
const ACCEL = 20;
const JUMP_FORCE = 4;
const PITCH_LIMIT = 1.4;

const keys: Record<string, "forward" | "backward" | "left" | "right" | "jump"> = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};

const moveFieldByKey = (key: string) => keys[key];

function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      if (field) setMovement((m) => ({ ...m, [field]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      if (field) setMovement((m) => ({ ...m, [field]: false }));
    };
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
  const isTouch = useTouchDevice();
  const quality = useQualityProfile();
  const headSegments: [number, number] = quality.isMobile ? [8, 6] : [12, 8];

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 5, 0],
    args: [0.8],
    fixedRotation: true,
    linearDamping: 0.1,
  }));

  const { forward, backward, left, right, jump } = usePlayerControls();
  const mobileMove = useInputStore((s) => s.move);
  const mobileJump = useInputStore((s) => s.jump);
  const consumeLookDelta = useInputStore((s) => s.consumeLookDelta);
  const { camera } = useThree();
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const position = useRef<[number, number, number]>([0, 0, 0]);
  const prevJumpDown = useRef(false);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const cameraInitialized = useRef(false);

  useEffect(() => {
    api.velocity.subscribe((v) => {
      velocity.current = v;
    });
    api.position.subscribe((p) => {
      position.current = p;
    });
  }, [api]);

  const currentVelocity = useRef(new THREE.Vector3());
  const front = useRef(new THREE.Vector3());
  const rightV = useRef(new THREE.Vector3());
  const moveDir = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const [x, y, z] = position.current;

    if (isTouch) {
      if (!cameraInitialized.current) {
        yaw.current = camera.rotation.y;
        pitch.current = camera.rotation.x;
        cameraInitialized.current = true;
      }
      const look = consumeLookDelta();
      yaw.current -= look.x;
      pitch.current = THREE.MathUtils.clamp(pitch.current - look.y, -PITCH_LIMIT, PITCH_LIMIT);
      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
    }

    camera.position.set(x, y + 1.8, z);

    moveDir.current.set(0, 0, 0);

    front.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
    front.current.y = 0;
    front.current.normalize();

    rightV.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
    rightV.current.y = 0;
    rightV.current.normalize();

    if (isTouch && (Math.abs(mobileMove.x) > 0.05 || Math.abs(mobileMove.y) > 0.05)) {
      moveDir.current
        .addScaledVector(front.current, mobileMove.y)
        .addScaledVector(rightV.current, mobileMove.x);
    } else {
      if (forward) moveDir.current.add(front.current);
      if (backward) moveDir.current.sub(front.current);
      if (right) moveDir.current.add(rightV.current);
      if (left) moveDir.current.sub(rightV.current);
    }

    if (moveDir.current.lengthSq() > 0) moveDir.current.normalize();

    currentVelocity.current.set(velocity.current[0], velocity.current[1], velocity.current[2]);

    const isUnderwater = y < -0.5;
    const speed = isUnderwater ? MOVE_SPEED * 0.5 : MOVE_SPEED;
    const target = moveDir.current.multiplyScalar(speed);

    const vx = THREE.MathUtils.damp(currentVelocity.current.x, target.x, ACCEL, dt);
    const vz = THREE.MathUtils.damp(currentVelocity.current.z, target.z, ACCEL, dt);

    let vy = velocity.current[1];
    const isGrounded = Math.abs(vy) < 0.1;
    const wantJump = jump || mobileJump;

    if (wantJump && !prevJumpDown.current && (isGrounded || isUnderwater)) {
      vy = JUMP_FORCE;
    }
    prevJumpDown.current = !!wantJump;

    api.velocity.set(vx, vy, vz);
  });

  return (
    <group ref={ref as React.RefObject<THREE.Group>}>
      <mesh castShadow={quality.shadows}>
        <capsuleGeometry args={[0.4, 1.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow={quality.shadows}>
        <sphereGeometry args={[0.3, ...headSegments]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      {!quality.isMobile && (
        <>
          <mesh position={[-0.1, 0.9, 0.25]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          <mesh position={[0.1, 0.9, 0.25]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </>
      )}
    </group>
  );
}
