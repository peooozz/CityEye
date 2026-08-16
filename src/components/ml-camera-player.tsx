"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, MLTrackedObject } from "@/lib/types";
import { useMLVisionTracker } from "@/lib/ml-detector";
import {
  ShieldAlert,
  Navigation,
  Sparkles,
  Layers,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

interface MLCameraPlayerProps {
  camera: Camera;
  showOverlays?: boolean;
  showZones?: boolean;
  showHelmetDetector?: boolean;
  showWrongSideDetector?: boolean;
  onInspect?: (cameraId: string) => void;
}

export function MLCameraPlayer({
  camera,
  showOverlays = true,
  showZones = true,
  showHelmetDetector = true,
  showWrongSideDetector = true,
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

  const violations = tracks.filter((t) => t.isViolation);
  const helmetViolations = tracks.filter((t) => t.violationType === "no_helmet");
  const wrongSideViolations = tracks.filter((t) => t.violationType === "wrong_side");

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
              {violations.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-red-500/15 text-red-700 border border-red-500/30 animate-pulse flex items-center gap-1">
                  <AlertTriangle size={10} />
                  {violations.length} INFRACTION{violations.length > 1 ? "S" : ""}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono-data text-[#5A6B7C]">
              {camera.id} · {camera.junctionType || "Nagpur CCTV Node"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 font-bold">
            LIVE · {camera.fps} FPS
          </span>
          {onInspect && (
            <button
              onClick={() => onInspect(camera.id)}
              className="p-1.5 rounded-full bg-white/60 hover:bg-white text-[#192837] transition-colors cursor-pointer shadow-sm"
              title="Inspect CCTV & ML telemetry"
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ══ Video Player + ML Computer Vision HUD ═════════════════════ */}
      <div className="relative aspect-video bg-[#0C121E] overflow-hidden flex items-center justify-center">
        {/* Real Looping CCTV Video Feed */}
        <video
          ref={videoRef}
          src={camera.videoSrc || "/videos/cctv_feed_1.mp4"}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dynamic Dark Gradient Scrim for crisp ML overlays */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* SVG Zone Polygons Layer */}
        {showZones && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Restricted / No-Parking Polygon */}
            <polygon
              points="10,25 35,20 40,75 8,82"
              fill="rgba(115,66,226,0.18)"
              stroke="#7342E2"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
            />
            {/* Traffic Flow Direction Corridor */}
            <polygon
              points="55,10 95,10 98,90 52,90"
              fill="rgba(0,132,255,0.08)"
              stroke="#0084FF"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
            />
          </svg>
        )}

        {/* ══ ML Real-Time Bounding Box & Vector Overlays ═══════════════ */}
        {showOverlays && (
          <div className="absolute inset-0 pointer-events-none">
            {tracks.map((trk) => {
              if (trk.violationType === "no_helmet" && !showHelmetDetector) return null;
              if (trk.violationType === "wrong_side" && !showWrongSideDetector) return null;

              const isNoHelmet = trk.violationType === "no_helmet";
              const isWrongSide = trk.violationType === "wrong_side";

              const borderColor = isNoHelmet
                ? "#FF3B30"
                : isWrongSide
                ? "#FF9500"
                : trk.isViolation
                ? "#FF4D4F"
                : "#10B981";

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
                  transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                >
                  {/* Bounding Box Border */}
                  <div
                    className="w-full h-full rounded-md border-2 relative"
                    style={{
                      borderColor: borderColor,
                      boxShadow: trk.isViolation
                        ? `0 0 16px ${borderColor}80, inset 0 0 10px ${borderColor}30`
                        : "none",
                    }}
                  >
                    {/* Top Label Tag */}
                    <div
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[9px] font-mono-data font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                      style={{ backgroundColor: borderColor }}
                    >
                      {isNoHelmet && <ShieldAlert size={10} />}
                      {isWrongSide && <Navigation size={10} className="rotate-180" />}
                      <span>{trk.label}</span>
                    </div>

                    {/* Rider Head Zoom / Helmet Detector Marker */}
                    {isNoHelmet && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/30 flex items-center justify-center animate-ping" />
                    )}

                    {/* Direction Vector Arrow (Wrong-Side Indicator) */}
                    {isWrongSide && (
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-600 text-white text-[8.5px] font-mono-data font-bold flex items-center gap-1 shadow-lg">
                        <Compass size={10} className="animate-spin" />
                        <span>{trk.speedKmph} km/h · 180° REVERSE</span>
                      </div>
                    )}

                    {/* Bottom Metadata Chip (Plate + Confidence) */}
                    <div className="absolute -bottom-5 right-0 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-md text-[8px] font-mono-data text-white/90 border border-white/20">
                      {trk.licensePlate} · {Math.round(trk.confidence * 100)}%
                    </div>
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
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono-data bg-black/65 backdrop-blur-xl text-emerald-400 border border-white/20 font-bold">
            YOLOv8 + ByteTrack
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
          {helmetViolations.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-data bg-red-600/90 text-white font-bold shadow-md animate-bounce">
              NO HELMET
            </span>
          )}
          {wrongSideViolations.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-data bg-amber-600/90 text-white font-bold shadow-md animate-bounce">
              WRONG SIDE
            </span>
          )}
        </div>
      </div>

      {/* ══ Card Footer Telemetry ═════════════════════════════════════ */}
      <div className="px-5 py-3 bg-white/40 border-t border-white/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-[#5A6B7C] text-[11px] font-mono-data">
          <span>
            Tracked: <strong className="text-[#192837]">{tracks.length} Targets</strong>
          </span>
          <span>
            Helmet Violations:{" "}
            <strong className={helmetViolations.length > 0 ? "text-red-600 font-bold" : "text-emerald-700"}>
              {helmetViolations.length}
            </strong>
          </span>
          <span>
            Wrong Side:{" "}
            <strong className={wrongSideViolations.length > 0 ? "text-amber-700 font-bold" : "text-emerald-700"}>
              {wrongSideViolations.length}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Auto Challan & Fine Notice triggered for ${camera.name} violations!`)}
            className="px-3.5 py-1 rounded-full bg-[#7342E2] hover:bg-[#6434d3] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
          >
            Issue Challan
          </button>
        </div>
      </div>
    </div>
  );
}
