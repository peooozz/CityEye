"use client";

import { useState, useEffect, useRef } from "react";
import { MLTrackedObject } from "./types";

// Preset simulated ML tracks tailored for CCTV camera motorcycle helmet views
const CAMERA_PRESET_TRACKS: Record<string, MLTrackedObject[]> = {
  "CAM-001": [
    {
      id: "MOTO-108",
      type: "motorcycle_no_helmet",
      x: 34,
      y: 38,
      width: 20,
      height: 32,
      yoloConfidence: 0.98,
      vgg16Confidence: 0.968,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET VIOLATION (VGG16 96.8%)",
      licensePlate: "MH-31-BK-4091",
      riderCount: 1,
      headCropY: 38,
      headCropHeight: 10,
    },
    {
      id: "MOTO-214",
      type: "motorcycle_helmet",
      x: 66,
      y: 44,
      width: 18,
      height: 30,
      yoloConfidence: 0.97,
      vgg16Confidence: 0.992,
      isViolation: false,
      violationType: "no_helmet",
      label: "Helmet Verified (Compliant ✓)",
      licensePlate: "MH-31-TR-9902",
      riderCount: 1,
      headCropY: 44,
      headCropHeight: 9,
    },
    {
      id: "MOTO-305",
      type: "motorcycle_triple_no_helmet",
      x: 14,
      y: 48,
      width: 22,
      height: 34,
      yoloConfidence: 0.95,
      vgg16Confidence: 0.974,
      isViolation: true,
      violationType: "no_helmet",
      label: "TRIPLE RIDING · NO HELMET (3 RIDERS)",
      licensePlate: "MH-40-AQ-1204",
      riderCount: 3,
      headCropY: 48,
      headCropHeight: 11,
    },
  ],
  "CAM-002": [
    {
      id: "MOTO-412",
      type: "motorcycle_no_helmet",
      x: 46,
      y: 36,
      width: 19,
      height: 30,
      yoloConfidence: 0.96,
      vgg16Confidence: 0.954,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET (PILLION + RIDER)",
      licensePlate: "MH-31-EF-8821",
      riderCount: 2,
      headCropY: 36,
      headCropHeight: 10,
    },
    {
      id: "MOTO-519",
      type: "motorcycle_helmet",
      x: 20,
      y: 42,
      width: 18,
      height: 28,
      yoloConfidence: 0.99,
      vgg16Confidence: 0.988,
      isViolation: false,
      violationType: "no_helmet",
      label: "Helmet Verified ✓",
      licensePlate: "MH-31-ZZ-7711",
      riderCount: 1,
      headCropY: 42,
      headCropHeight: 9,
    },
  ],
  "CAM-003": [
    {
      id: "MOTO-604",
      type: "motorcycle_no_helmet",
      x: 40,
      y: 40,
      width: 21,
      height: 32,
      yoloConfidence: 0.98,
      vgg16Confidence: 0.978,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET DETECTED (SECTION 194D)",
      licensePlate: "MH-49-CC-3419",
      riderCount: 1,
      headCropY: 40,
      headCropHeight: 10,
    },
    {
      id: "MOTO-708",
      type: "motorcycle_helmet",
      x: 68,
      y: 34,
      width: 17,
      height: 28,
      yoloConfidence: 0.99,
      vgg16Confidence: 0.995,
      isViolation: false,
      violationType: "no_helmet",
      label: "Helmet Verified ✓",
      licensePlate: "MH-31-DX-5509",
      riderCount: 1,
      headCropY: 34,
      headCropHeight: 9,
    },
  ],
  "CAM-004": [
    {
      id: "MOTO-811",
      type: "motorcycle_no_helmet",
      x: 50,
      y: 42,
      width: 20,
      height: 32,
      yoloConfidence: 0.94,
      vgg16Confidence: 0.962,
      isViolation: true,
      violationType: "no_helmet",
      label: "NO HELMET · DOUBLE RIDING",
      licensePlate: "MH-31-HN-2388",
      riderCount: 2,
      headCropY: 42,
      headCropHeight: 10,
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
          const dy = Math.sin(t * 0.15 + (trk.riderCount || 1)) * 1.2;
          const dx = Math.cos(t * 0.18 + (trk.riderCount || 1)) * 0.9;

          const newX = Math.max(10, Math.min(78, trk.x + dx));
          const newY = Math.max(18, Math.min(70, trk.y + dy));

          return {
            ...trk,
            x: parseFloat(newX.toFixed(2)),
            y: parseFloat(newY.toFixed(2)),
            headCropY: parseFloat(newY.toFixed(2)),
          };
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, [cameraId]);

  return tracks;
}
