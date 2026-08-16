"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { cameras } from "@/lib/mock-data";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { MLCameraPlayer } from "@/components/ml-camera-player";
import {
  ShieldAlert,
  Navigation,
  Sparkles,
  Layers,
  Minimize2,
  AlertTriangle,
  FileCheck2,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveFeedsPage() {
  useSimulatedSocket();
  const [selectedCam, setSelectedCam] = useState<string>("all");
  const [gridMode, setGridMode] = useState<"2x2" | "single">("2x2");
  const [showOverlays, setShowOverlays] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showHelmetDetector, setShowHelmetDetector] = useState(true);
  const [showWrongSideDetector, setShowWrongSideDetector] = useState(true);
  const [activeInspectedCam, setActiveInspectedCam] = useState<string | null>(null);

  const displayedCameras =
    selectedCam === "all" ? cameras : cameras.filter((c) => c.id === selectedCam);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#192837] overflow-x-hidden selection:bg-[#7342E2] selection:text-white font-body">
      {/* ══ Ambient Video & Luminous Liquid Glows ═════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        >
          <source src="/videos/cctv_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/40 to-white/75" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7342E2]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#0084FF]/10 blur-[140px]" />
      </div>

      {/* ══ Floating Cylinder Glass Navbar ════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* ══ Top Toolbar & ML Vision Controls ══════════════════════════ */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold font-heading text-[#192837]">
                Nagpur CCTV Live AI Stream Matrix
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono-data bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 backdrop-blur-md font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                4/4 CAMERAS STREAMING
              </span>
            </div>
            <p className="text-xs text-[#5A6B7C]">
              Real-time YOLOv8 Computer Vision Pipeline tracking <strong>No-Helmet Riders</strong> &amp; <strong>Wrong-Side Trajectories</strong>
            </p>
          </div>

          {/* AI Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* No-Helmet Detector Toggle */}
            <button
              onClick={() => setShowHelmetDetector(!showHelmetDetector)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showHelmetDetector
                  ? "bg-red-500/15 text-red-700 border-red-500/40 shadow-red-500/10"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <ShieldAlert size={14} className={showHelmetDetector ? "text-red-600 animate-pulse" : ""} />
              <span>Helmet AI: {showHelmetDetector ? "ACTIVE" : "PAUSED"}</span>
            </button>

            {/* Wrong-Side Vector Tracker Toggle */}
            <button
              onClick={() => setShowWrongSideDetector(!showWrongSideDetector)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showWrongSideDetector
                  ? "bg-amber-500/20 text-amber-800 border-amber-500/40 shadow-amber-500/10"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Navigation size={14} className={`rotate-180 ${showWrongSideDetector ? "text-amber-700" : ""}`} />
              <span>Wrong-Side AI: {showWrongSideDetector ? "ACTIVE" : "PAUSED"}</span>
            </button>

            {/* AI BBoxes Toggle */}
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showOverlays
                  ? "bg-[#7342E2]/15 text-[#7342E2] border-[#7342E2]/40"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Sparkles size={13} />
              <span>Bounding Boxes: {showOverlays ? "ON" : "OFF"}</span>
            </button>

            {/* Polygon Zones Toggle */}
            <button
              onClick={() => setShowZones(!showZones)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showZones
                  ? "bg-blue-500/15 text-blue-700 border-blue-500/40"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Layers size={13} />
              <span>Zones: {showZones ? "ON" : "OFF"}</span>
            </button>

            {/* Grid Layout Mode */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/50 backdrop-blur-xl border border-white/70 shadow-sm">
              {(["2x2", "single"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGridMode(mode)}
                  className={`px-3 py-1 rounded-full text-xs font-mono-data uppercase transition-all font-bold cursor-pointer ${
                    gridMode === mode
                      ? "bg-white text-[#192837] shadow-sm"
                      : "text-[#5A6B7C] hover:text-[#192837]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Live Detection Telemetry Banner ═══════════════════════════ */}
        <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/80 flex items-center justify-between overflow-x-auto text-xs gap-4 shadow-sm">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-[#192837] uppercase tracking-wider text-[11px]">
              Live ML Violation Stream:
            </span>
          </div>
          <div className="flex items-center gap-6 text-[#5A6B7C] font-mono-data text-[11px] whitespace-nowrap overflow-x-auto">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <ShieldAlert size={13} />
              [01:44:12] No Helmet: Bike #MH-31-BK-4091 (Wardha Rd) · Conf: 96%
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-bold">
              <Navigation size={13} className="rotate-180" />
              [01:44:19] Wrong Side: Auto #MH-31-ZZ-7711 (Sitabuldi) · 185° Reverse Flow
            </span>
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <ShieldAlert size={13} />
              [01:44:28] No Helmet (Triple Riding): Bike #MH-31-TR-9902 (Ambazari) · Conf: 94%
            </span>
          </div>
        </div>

        {/* ══ Camera Feeds Grid ═════════════════════════════════════════ */}
        <div
          className={`grid gap-5 ${
            gridMode === "single" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {displayedCameras.map((camera) => (
            <MLCameraPlayer
              key={camera.id}
              camera={camera}
              showOverlays={showOverlays}
              showZones={showZones}
              showHelmetDetector={showHelmetDetector}
              showWrongSideDetector={showWrongSideDetector}
              onInspect={(id) => setActiveInspectedCam(id)}
            />
          ))}
        </div>
      </div>

      {/* ══ Inspection Modal / Fullscreen ═══════════════════════════════ */}
      <AnimatePresence>
        {activeInspectedCam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#192837]/40 backdrop-blur-xl"
            onClick={() => setActiveInspectedCam(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-5xl rounded-3xl bg-white/95 backdrop-blur-3xl border border-white shadow-2xl overflow-hidden text-[#192837]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h2 className="text-base font-bold font-heading text-[#192837]">
                      {cameras.find((c) => c.id === activeInspectedCam)?.name} — Deep ML Stream Inspector
                    </h2>
                    <span className="text-xs text-[#5A6B7C] font-mono-data">
                      Camera ID: {activeInspectedCam} · Streaming 1080p H.264
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveInspectedCam(null)}
                  className="p-2 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#192837] transition-colors cursor-pointer"
                >
                  <Minimize2 size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="aspect-video bg-[#0C121E] rounded-2xl overflow-hidden border border-white/20 relative shadow-inner">
                  <video
                    src={cameras.find((c) => c.id === activeInspectedCam)?.videoSrc || "/videos/cctv_feed_1.mp4"}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono-data font-bold border border-white/20">
                    REAL-TIME INFERENCE: ACTIVE (34 FPS)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Helmet Model</span>
                    <span className="text-sm font-bold font-mono-data text-red-600">YOLOv8-HeadCrop (96%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Wrong-Way Tracker</span>
                    <span className="text-sm font-bold font-mono-data text-amber-700">ByteTrack Optical Flow</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Inference Latency</span>
                    <span className="text-sm font-bold font-mono-data text-emerald-700">18.4ms</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Auto-Challan SLA</span>
                    <span className="text-sm font-bold font-mono-data text-[#7342E2]">Under 2.0s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
