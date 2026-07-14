"use client";
import React, { Suspense } from "react";
import Scene from "@/src/scene/Scene";

function LoadingScreen() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a1628",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Loading world...
        </div>
        <div style={{ fontSize: 13, opacity: 0.6 }}>Preparing ocean & islands</div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Scene />
    </Suspense>
  );
}
