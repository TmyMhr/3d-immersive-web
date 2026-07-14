"use client";
import React, { useRef, useMemo } from "react";
import { useThree, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import type { QualityProfile } from "../hooks/useQualityProfile";

type Props = {
  sunPosition?: [number, number, number];
  quality: QualityProfile;
};

export default function Ocean({
  sunPosition = [100, 50, 100],
  quality,
}: Props): React.ReactElement {
  const waterRef = useRef<InstanceType<typeof Water>>(null);
  const { clock } = useThree();

  const waterNormals = useLoader(THREE.TextureLoader, "/assets/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(
    () =>
      new THREE.PlaneGeometry(
        quality.oceanSize,
        quality.oceanSize,
        quality.oceanSegments,
        quality.oceanSegments
      ),
    [quality.oceanSize, quality.oceanSegments]
  );

  const water = useMemo(() => {
    return new Water(geom, {
      textureWidth: quality.waterTextureSize,
      textureHeight: quality.waterTextureSize,
      waterNormals,
      alpha: 0.8,
      sunDirection: new THREE.Vector3().fromArray(sunPosition).normalize(),
      sunColor: new THREE.Color(0xffffff),
      waterColor: new THREE.Color(0x2aa3ff),
      distortionScale: quality.isMobile ? 2.2 : 2.8,
      fog: true,
      side: THREE.FrontSide,
    });
  }, [geom, waterNormals, sunPosition, quality.waterTextureSize, quality.isMobile]);

  useFrame(() => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <primitive
      ref={waterRef}
      object={water}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
    />
  );
}
