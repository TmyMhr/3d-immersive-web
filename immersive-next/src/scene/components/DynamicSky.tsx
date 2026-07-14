"use client";
import React from "react";
import { Sky } from "@react-three/drei";

type Props = {
  sunPosition: [number, number, number];
  azimuth: number;
  distance?: number;
};

export default function DynamicSky({
  sunPosition,
  azimuth,
  distance = 450000,
}: Props): React.ReactElement {
  return <Sky distance={distance} sunPosition={sunPosition} azimuth={azimuth} />;
}
