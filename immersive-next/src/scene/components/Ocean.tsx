"use client";
import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

export default function Ocean({ sunPosition = [100, 50, 100] as [number, number, number] }): JSX.Element {
  const ref = useRef<any>();
  const { clock } = useThree();

  const waterNormals = useLoader(THREE.TextureLoader, "/assets/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(() => new THREE.PlaneGeometry(50000, 50000, 64, 64), []);

  const config = useMemo(
    () => ({
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      alpha: 0.8,
      sunDirection: new THREE.Vector3().fromArray(sunPosition).normalize(),
      sunColor: new THREE.Color(0xffffff),
      waterColor: new THREE.Color(0x2aa3ff),
      distortionScale: 2.8,
      fog: true,
      side: THREE.FrontSide,
    }),
    [waterNormals, sunPosition]
  );

  useFrame(() => {
    if (ref.current) {
      ref.current.material.uniforms.time.value = clock.getElapsedTime() * 0.5;
    }
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} />;
}


