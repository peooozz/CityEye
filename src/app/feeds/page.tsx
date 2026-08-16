"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { cameras } from "@/lib/mock-data";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { MLCameraPlayer } from "@/components/ml-camera-player";
import {
  ShieldAlert,
  Sparkles,
  Minimize2,
  FileCheck2,
  Filter,
  Layers,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveFeedsPage() {
  useSimulatedSocket();
  const [selectedCam, setSelectedCam] = useState<string>("all");
  const [gridMode, setGridMode] = useState<"2x2" | "single">("2x2");
  const [showOverlays, setShowOverlays] = useState(true);
  const [showHeadROI, setShowHeadROI] = useState(true);
  const [showPlateOCR, setShowPlateOCR] = useState(true);
  const [showViolationsOnly, setShowViolationsOnly] = useState(false);
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
          <source src="/videos/helmet_traffic_raw.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/40 to-white/75" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7342E2]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#FF3B30]/8 blur-[140px]" />
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
                Nagpur CCTV Non-Helmet Detection Matrix
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono-data bg-red-500/15 text-red-700 border border-red-500/30 backdrop-blur-md font-bold">
                <ShieldAlert size={12} />
                YOLOv8 + VGG16 ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#5A6B7C]">
              Real-time Two-Stage AI Pipeline: <strong>YOLOv8 Motorcycle Localization</strong> ➔ <strong>VGG16 Head-Crop Helmet Classification</strong> ➔ <strong>ANPR OCR E-Challan</strong>
            </p>
          </div>

          {/* AI Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Head ROI Crop Box Toggle */}
            <button
              onClick={() => setShowHeadROI(!showHeadROI)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showHeadROI
                  ? "bg-red-500/15 text-red-700 border-red-500/40 shadow-red-500/10"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Cpu size={14} className={showHeadROI ? "text-red-600" : ""} />
              <span>VGG16 Head ROI: {showHeadROI ? "ON" : "OFF"}</span>
            </button>

            {/* License Plate OCR Toggle */}
            <button
              onClick={() => setShowPlateOCR(!showPlateOCR)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showPlateOCR
                  ? "bg-[#7342E2]/15 text-[#7342E2] border-[#7342E2]/40"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <FileCheck2 size={14} />
              <span>Plate ANPR: {showPlateOCR ? "ON" : "OFF"}</span>
            </button>

            {/* Violations Only Filter Toggle */}
            <button
              onClick={() => setShowViolationsOnly(!showViolationsOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showViolationsOnly
                  ? "bg-amber-500/20 text-amber-800 border-amber-500/40"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Filter size={13} />
              <span>{showViolationsOnly ? "Violations Only" : "Show All Bikes"}</span>
            </button>

            {/* Bounding Boxes Toggle */}
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl transition-all shadow-sm cursor-pointer ${
                showOverlays
                  ? "bg-black/[0.08] text-[#192837] border-black/15"
                  : "bg-white/60 text-[#5A6B7C] border-white/80 hover:bg-white"
              }`}
            >
              <Sparkles size={13} />
              <span>BBoxes: {showOverlays ? "ON" : "OFF"}</span>
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

        {/* ══ Live Non-Helmet Detection Ticker ═════════════════════════ */}
        <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/80 flex items-center justify-between overflow-x-auto text-xs gap-4 shadow-sm">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-[#192837] uppercase tracking-wider text-[11px]">
              Live Non-Helmet Ingestion Stream:
            </span>
          </div>
          <div className="flex items-center gap-6 text-[#5A6B7C] font-mono-data text-[11px] whitespace-nowrap overflow-x-auto">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <ShieldAlert size={13} />
              [02:44:10] NO HELMET: Bike #MH-31-BK-4091 · VGG16: 96.8% · Fine: ₹1,000
            </span>
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <ShieldAlert size={13} />
              [02:44:18] NO HELMET (2 RIDERS): Bike #MH-31-EF-8821 · VGG16: 95.4% · Fine: ₹2,000
            </span>
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <ShieldAlert size={13} />
              [02:44:26] TRIPLE RIDING (NO HELMET): Bike #MH-40-AQ-1204 · Fine: ₹3,000
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
              showHeadROI={showHeadROI}
              showPlateOCR={showPlateOCR}
              showViolationsOnly={showViolationsOnly}
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
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <h2 className="text-base font-bold font-heading text-[#192837]">
                      {cameras.find((c) => c.id === activeInspectedCam)?.name} — YOLOv8 + VGG16 Helmet Diagnostic Pipeline
                    </h2>
                    <span className="text-xs text-[#5A6B7C] font-mono-data">
                      ThanhSan97 Multi-Stage Architecture · 1080p Real-Time Ingest
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
                    src={cameras.find((c) => c.id === activeInspectedCam)?.videoSrc || "/videos/helmet_traffic_raw.mp4"}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono-data font-bold border border-white/20">
                    STAGE 1 (YOLOv8) + STAGE 2 (VGG16) + STAGE 3 (ANPR OCR)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Stage 1: Motorcycle YOLO</span>
                    <span className="text-sm font-bold font-mono-data text-[#7342E2]">YOLOv8n (98.2%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Stage 2: Helmet Classifier</span>
                    <span className="text-sm font-bold font-mono-data text-red-600">VGG16 Head Crop (96.8%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Stage 3: ANPR OCR</span>
                    <span className="text-sm font-bold font-mono-data text-emerald-700">VGG16 OCR (95.1%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white shadow-sm">
                    <span className="text-[10px] text-[#5A6B7C] block uppercase font-bold">Penalty / Fine</span>
                    <span className="text-sm font-bold font-mono-data text-red-600">₹1,000 / Rider</span>
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
