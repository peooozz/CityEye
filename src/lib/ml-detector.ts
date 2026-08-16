"use client";

import { useState, useEffect, useRef } from "react";
import { MLTrackedObject } from "./types";
import { useDashboardStore } from "./store";

// Preset simulated ML tracks tailored for CCTV camera views
const CAMERA_PRESET_TRACKS: Record<string, MLTrackedObject[]> = {
  "CAM-001": [
    {
      id: "TRK-108",
      type: "motorcycle_no_helmet",
      x: 32,
      y: 42,
      width: 18,
      height: 28,
      confidence: 0.96,
      speedKmph: 42,
      headingAngle: 12,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET VIOLATION",
      licensePlate: "MH-31-BK-4091",
      trailPoints: [
        { x: 30, y: 32 },
        { x: 31, y: 37 },
        { x: 32, y: 42 },
      ],
    },
    {
      id: "TRK-214",
      type: "car_wrong_side",
      x: 64,
      y: 50,
      width: 22,
      height: 20,
      confidence: 0.94,
      speedKmph: 36,
      headingAngle: 178,
      isViolation: true,
      violationType: "wrong_side",
      label: "WRONG SIDE VECTOR (178° REVERSE)",
      licensePlate: "MH-31-TR-9902",
      trailPoints: [
        { x: 60, y: 68 },
        { x: 62, y: 58 },
        { x: 64, y: 50 },
      ],
    },
    {
      id: "TRK-305",
      type: "car_normal",
      x: 12,
      y: 60,
      width: 24,
      height: 22,
      confidence: 0.98,
      speedKmph: 48,
      headingAngle: 5,
      isViolation: false,
      label: "Vehicle · Compliant",
      licensePlate: "MH-40-AQ-1204",
      trailPoints: [
        { x: 10, y: 45 },
        { x: 11, y: 52 },
        { x: 12, y: 60 },
      ],
    },
  ],
  "CAM-002": [
    {
      id: "TRK-412",
      type: "motorcycle_no_helmet",
      x: 48,
      y: 38,
      width: 16,
      height: 26,
      confidence: 0.95,
      speedKmph: 34,
      headingAngle: 15,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET (2 RIDERS)",
      licensePlate: "MH-31-EF-8821",
      trailPoints: [
        { x: 45, y: 26 },
        { x: 47, y: 32 },
        { x: 48, y: 38 },
      ],
    },
    {
      id: "TRK-519",
      type: "auto_wrong_side",
      x: 22,
      y: 48,
      width: 20,
      height: 22,
      confidence: 0.92,
      speedKmph: 29,
      headingAngle: 185,
      isViolation: true,
      violationType: "wrong_side",
      label: "WRONG SIDE (AUTO AGAINST TRAFFIC)",
      licensePlate: "MH-31-ZZ-7711",
      trailPoints: [
        { x: 20, y: 62 },
        { x: 21, y: 55 },
        { x: 22, y: 48 },
      ],
    },
  ],
  "CAM-003": [
    {
      id: "TRK-604",
      type: "car_wrong_side",
      x: 42,
      y: 46,
      width: 24,
      height: 22,
      confidence: 0.97,
      speedKmph: 44,
      headingAngle: 172,
      isViolation: true,
      violationType: "wrong_side",
      label: "WRONG SIDE / ILLEGAL U-TURN",
      licensePlate: "MH-49-CC-3419",
      trailPoints: [
        { x: 38, y: 60 },
        { x: 40, y: 52 },
        { x: 42, y: 46 },
      ],
    },
    {
      id: "TRK-708",
      type: "motorcycle_helmet",
      x: 70,
      y: 35,
      width: 15,
      height: 24,
      confidence: 0.99,
      speedKmph: 38,
      headingAngle: 8,
      isViolation: false,
      label: "Helmet Verified ✓",
      licensePlate: "MH-31-DX-5509",
    },
  ],
  "CAM-004": [
    {
      id: "TRK-811",
      type: "motorcycle_no_helmet",
      x: 52,
      y: 44,
      width: 17,
      height: 27,
      confidence: 0.93,
      speedKmph: 52,
      headingAngle: 10,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET · HIGH SPEED",
      licensePlate: "MH-31-TR-9902",
      trailPoints: [
        { x: 50, y: 30 },
        { x: 51, y: 36 },
        { x: 52, y: 44 },
      ],
    },
  ],
};

export function useMLVisionTracker(cameraId: string) {
  const [tracks, setTracks] = useState<MLTrackedObject[]>(() => {
    return CAMERA_PRESET_TRACKS[cameraId] || CAMERA_PRESET_TRACKS["CAM-001"];
  });

  const frameRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      frameRef.current += 1;
      const t = frameRef.current;

      setTracks((prev) =>
        prev.map((trk) => {
          // Dynamic jitter & forward motion simulation
          const isWrongSide = trk.violationType === "wrong_side";
          const dy = isWrongSide ? (Math.sin(t * 0.15) * 1.5) : (Math.cos(t * 0.15) * 1.5);
          const dx = Math.sin(t * 0.2 + (trk.headingAngle || 0)) * 0.8;

          const newX = Math.max(8, Math.min(84, trk.x + dx));
          const newY = Math.max(15, Math.min(75, trk.y + dy));

          const updatedTrail = trk.trailPoints
            ? [...trk.trailPoints.slice(-3), { x: newX, y: newY }]
            : undefined;

          return {
            ...trk,
            x: parseFloat(newX.toFixed(2)),
            y: parseFloat(newY.toFixed(2)),
            trailPoints: updatedTrail,
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [cameraId]);

  return tracks;
}
