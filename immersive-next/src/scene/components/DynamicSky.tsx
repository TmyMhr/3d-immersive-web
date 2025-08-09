"use client";
import React from "react";
import { Sky } from "@react-three/drei";

type Props = {
  sunPosition: [number, number, number];
  azimuth: number;
};

export default function DynamicSky({ sunPosition, azimuth }: Props): JSX.Element {
  return <Sky distance={450000} sunPosition={sunPosition} azimuth={azimuth} />;
}


