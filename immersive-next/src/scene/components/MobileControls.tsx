"use client";
import { useState, useCallback, useRef } from "react";
import { useInputStore } from "../store/input";
import { useTouchDevice } from "../hooks/useTouchDevice";

const JOYSTICK_RADIUS = 60;
const LOOK_SENSITIVITY = 0.003;

const safeBottom = "max(16px, env(safe-area-inset-bottom))";
const safeLeft = "max(16px, env(safe-area-inset-left))";
const safeRight = "max(16px, env(safe-area-inset-right))";

export default function MobileControls() {
  const isTouch = useTouchDevice();
  const setMove = useInputStore((s) => s.setMove);
  const setJump = useInputStore((s) => s.setJump);
  const addLookDelta = useInputStore((s) => s.addLookDelta);

  const [joystickActive, setJoystickActive] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [lookActive, setLookActive] = useState(false);
  const [lookPointerId, setLookPointerId] = useState<number | null>(null);
  const lastLookPos = useRef({ x: 0, y: 0 });

  const resetJoystick = useCallback(() => {
    setJoystickActive(false);
    setKnob({ x: 0, y: 0 });
    setMove({ x: 0, y: 0 });
  }, [setMove]);

  const onJoystickDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setJoystickActive(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onJoystickMove = (e: React.PointerEvent) => {
    if (!joystickActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(len, JOYSTICK_RADIUS);
    const nx = (dx / len) * clamped;
    const ny = (dy / len) * clamped;
    setKnob({ x: nx, y: ny });
    setMove({ x: nx / JOYSTICK_RADIUS, y: -ny / JOYSTICK_RADIUS });
  };

  const onLookDown = (e: React.PointerEvent) => {
    if (lookPointerId !== null) return;
    setLookActive(true);
    setLookPointerId(e.pointerId);
    lastLookPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onLookMove = (e: React.PointerEvent) => {
    if (!lookActive || e.pointerId !== lookPointerId) return;
    const dx = e.movementX !== 0 ? e.movementX : e.clientX - lastLookPos.current.x;
    const dy = e.movementY !== 0 ? e.movementY : e.clientY - lastLookPos.current.y;
    lastLookPos.current = { x: e.clientX, y: e.clientY };
    addLookDelta({
      x: dx * LOOK_SENSITIVITY,
      y: dy * LOOK_SENSITIVITY,
    });
  };

  const onLookUp = (e: React.PointerEvent) => {
    if (e.pointerId !== lookPointerId) return;
    setLookActive(false);
    setLookPointerId(null);
  };

  if (!isTouch) return null;

  return (
    <>
      {/* Right half: drag to look */}
      <div
        onPointerDown={onLookDown}
        onPointerMove={onLookMove}
        onPointerUp={onLookUp}
        onPointerCancel={onLookUp}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "55%",
          height: "100%",
          touchAction: "none",
          userSelect: "none",
          zIndex: 5,
        }}
      />

      {/* Joystick */}
      <div
        onPointerDown={onJoystickDown}
        onPointerMove={onJoystickMove}
        onPointerUp={resetJoystick}
        onPointerCancel={resetJoystick}
        style={{
          position: "absolute",
          left: safeLeft,
          bottom: safeBottom,
          width: 160,
          height: 160,
          borderRadius: 12,
          background: "rgba(0,0,0,0.2)",
          touchAction: "none",
          userSelect: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 20,
            width: JOYSTICK_RADIUS * 2,
            height: JOYSTICK_RADIUS * 2,
            borderRadius: JOYSTICK_RADIUS,
            border: "2px solid rgba(255,255,255,0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 20 + JOYSTICK_RADIUS + knob.x - 24,
            top: 20 + JOYSTICK_RADIUS + knob.y - 24,
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: joystickActive ? "none" : "left 120ms ease, top 120ms ease",
          }}
        />
      </div>

      {/* Jump */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          setJump(true);
        }}
        onPointerUp={() => setJump(false)}
        onPointerCancel={() => setJump(false)}
        style={{
          position: "absolute",
          right: safeRight,
          bottom: safeBottom,
          width: 72,
          height: 72,
          borderRadius: 36,
          border: "2px solid rgba(255,255,255,0.7)",
          background: "rgba(0,0,0,0.3)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          touchAction: "none",
          userSelect: "none",
          zIndex: 10,
        }}
      >
        Jump
      </button>

      {/* Hint */}
      <div
        style={{
          position: "absolute",
          top: "max(12px, env(safe-area-inset-top))",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 14px",
          borderRadius: 20,
          background: "rgba(0,0,0,0.35)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 12,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        Drag right to look · Left stick to move
      </div>
    </>
  );
}
