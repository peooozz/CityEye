"use client";

import { useState, useRef, useEffect } from "react";
import { Camera } from "@/lib/types";
import { useMLVisionTracker } from "@/lib/ml-detector";
import {
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  AlertTriangle,
  FileCheck2,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

interface MLCameraPlayerProps {
  camera: Camera;
  showOverlays?: boolean;
  showHeadROI?: boolean;
  showPlateOCR?: boolean;
  showViolationsOnly?: boolean;
  onInspect?: (cameraId: string) => void;
}

export function MLCameraPlayer({
  camera,
  showOverlays = true,
  showHeadROI = true,
  showPlateOCR = true,
  showViolationsOnly = false,
  onInspect,
}: MLCameraPlayerProps) {
  const tracks = useMLVisionTracker(camera.id);
  const [currentTime, setCurrentTime] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const displayedTracks = showViolationsOnly
    ? tracks.filter((t) => t.isViolation)
    : tracks;

  const helmetViolations = tracks.filter((t) => t.isViolation);
  const totalFinesInr = helmetViolations.reduce((sum, t) => sum + t.riderCount * 1000, 0);

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white/45 backdrop-blur-3xl border border-white/80 hover:border-[#7342E2]/60 hover:shadow-[0_12px_40px_rgba(115,66,226,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 flex flex-col justify-between shadow-[0_8px_32px_rgba(25,40,55,0.06)]">
      {/* ══ Card Header ═══════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/40 border-b border-white/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#192837] block">
                {camera.name}
              </span>
              {helmetViolations.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-red-500/15 text-red-700 border border-red-500/30 animate-pulse flex items-center gap-1">
                  <ShieldAlert size={10} />
                  {helmetViolations.length} NO-HELMET VIOLATION{helmetViolations.length > 1 ? "S" : ""}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono-data text-[#5A6B7C]">
              {camera.id} · {camera.junctionType || "Two-Wheeler Helmet Checkpoint"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-[#7342E2]/15 text-[#7342E2] border border-[#7342E2]/30 font-bold">
            YOLOv8 + VGG16 (30 FPS)
          </span>
          {onInspect && (
            <button
              onClick={() => onInspect(camera.id)}
              className="p-1.5 rounded-full bg-white/60 hover:bg-white text-[#192837] transition-colors cursor-pointer shadow-sm"
              title="Inspect YOLOv8 + VGG16 Pipeline"
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ══ Video Player + ML Computer Vision HUD ═════════════════════ */}
      <div className="relative aspect-video bg-[#0C121E] overflow-hidden flex items-center justify-center">
        {/* Real Looping Motorcycle Video Feed */}
        <video
          ref={videoRef}
          src={camera.videoSrc || "/videos/helmet_traffic_raw.mp4"}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dynamic Scrim for crisp ML overlays */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* ══ ML Real-Time Bounding Box & Head ROI Overlays ═════════════ */}
        {showOverlays && (
          <div className="absolute inset-0 pointer-events-none">
            {displayedTracks.map((trk) => {
              const isNoHelmet = trk.isViolation;
              const borderColor = isNoHelmet ? "#FF3B30" : "#10B981";

              return (
                <motion.div
                  key={trk.id}
                  className="absolute"
                  style={{
                    left: `${trk.x}%`,
                    top: `${trk.y}%`,
                    width: `${trk.width}%`,
                    height: `${trk.height}%`,
                  }}
                  transition={{ type: "tween", ease: "linear", duration: 0.25 }}
                >
                  {/* Motorcycle Outer Bounding Box (Stage 1: YOLOv8) */}
                  <div
                    className="w-full h-full rounded-lg border-2 relative"
                    style={{
                      borderColor: borderColor,
                      boxShadow: isNoHelmet
                        ? `0 0 16px ${borderColor}80, inset 0 0 10px ${borderColor}30`
                        : "none",
                    }}
                  >
                    {/* Top Label Tag */}
                    <div
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[9px] font-mono-data font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                      style={{ backgroundColor: borderColor }}
                    >
                      {isNoHelmet ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                      <span>{trk.label}</span>
                    </div>

                    {/* Rider Head ROI Crop Box (Stage 2: VGG16 Classifier) */}
                    {showHeadROI && (
                      <div
                        className={`absolute top-1 left-1/2 -translate-x-1/2 w-10 h-9 rounded-md border-2 ${
                          isNoHelmet
                            ? "border-red-500 bg-red-500/25 animate-pulse shadow-[0_0_12px_rgba(255,59,48,0.8)]"
                            : "border-emerald-400 bg-emerald-500/20"
                        } flex items-center justify-center`}
                      >
                        <span className="text-[7.5px] font-mono-data font-bold text-white uppercase">
                          {isNoHelmet ? "NO HELMET" : "HELMET ✓"}
                        </span>
                      </div>
                    )}

                    {/* License Plate Tag (Stage 3: ANPR OCR) */}
                    {showPlateOCR && (
                      <div className="absolute -bottom-5 right-0 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[8.5px] font-mono-data font-bold text-white border border-white/20 shadow-md">
                        {trk.licensePlate} · VGG16: {Math.round(trk.vgg16Confidence * 100)}%
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ══ Corner Live OSD Overlays ═════════════════════════════════ */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono-data bg-black/65 backdrop-blur-xl text-white border border-white/20 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC ● {currentTime} IST
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono-data bg-black/65 backdrop-blur-xl text-[#c2a4ff] border border-white/20 font-bold">
            ThanhSan97 Pipeline
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
          {helmetViolations.length > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono-data bg-red-600/95 text-white font-bold shadow-md animate-bounce flex items-center gap-1">
              <ShieldAlert size={11} />
              NO HELMET DETECTED
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono-data bg-emerald-600/90 text-white font-bold shadow-md">
              COMPLIANT
            </span>
          )}
        </div>
      </div>

      {/* ══ Card Footer Telemetry ═════════════════════════════════════ */}
      <div className="px-5 py-3 bg-white/40 border-t border-white/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-[#5A6B7C] text-[11px] font-mono-data">
          <span>
            Bikes Monitored: <strong className="text-[#192837]">{tracks.length}</strong>
          </span>
          <span>
            No-Helmet Violations:{" "}
            <strong className={helmetViolations.length > 0 ? "text-red-600 font-bold" : "text-emerald-700"}>
              {helmetViolations.length} Cases
            </strong>
          </span>
          <span>
            Total Fine: <strong className="text-red-600 font-bold">₹{totalFinesInr}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Automated E-Challan fine of ₹${totalFinesInr || 1000} (Section 194D) generated and dispatched for ${camera.name}!`)}
            className="px-3.5 py-1.5 rounded-full bg-[#7342E2] hover:bg-[#6434d3] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
          >
            <FileCheck2 size={12} />
            <span>Generate Challan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
