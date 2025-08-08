"use client";
import { useRef, useState, useEffect } from "react";
import { useInputStore } from "../store/input";

export default function MobileControls() {
  const setMove = useInputStore((s) => s.setMove);
  const setJump = useInputStore((s) => s.setJump);

  const zoneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const origin = useRef({ x: 0, y: 0 });
  const knob = useRef({ x: 0, y: 0 });
  const R = 60;

  useEffect(() => {
    const handleUp = () => {
      setActive(false);
      knob.current = { x: 0, y: 0 };
      setMove({ x: 0, y: 0 });
    };
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [setMove]);

  const onDown = (e: React.PointerEvent) => {
    setActive(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
  };

  const onMove = (e: React.PointerEvent) => {
    if (!active) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    const len = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(len, R);
    const nx = (dx / len) * clamped;
    const ny = (dy / len) * clamped;
    knob.current = { x: nx, y: ny };
    setMove({ x: nx / R, y: -ny / R });
  };

  const onJumpDown = () => setJump(true);
  const onJumpUp = () => setJump(false);

  return (
    <>
      <div
        ref={zoneRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          width: 160,
          height: 160,
          borderRadius: 12,
          background: "rgba(0,0,0,0.15)",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            width: R * 2,
            height: R * 2,
            borderRadius: R,
            border: "2px solid rgba(255,255,255,0.4)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40 + R + knob.current.x - 22,
            top: 40 + R + knob.current.y - 22,
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "rgba(255,255,255,0.85)",
            transition: active ? "none" : "transform 120ms ease",
          }}
        />
      </div>

      <button
        onPointerDown={onJumpDown}
        onPointerUp={onJumpUp}
        onPointerCancel={onJumpUp}
        style={{
          position: "absolute",
          right: 16,
          bottom: 28,
          width: 72,
          height: 72,
          borderRadius: 36,
          border: "2px solid rgba(255,255,255,0.7)",
          background: "rgba(0,0,0,0.25)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Jump
      </button>
    </>
  );
}


