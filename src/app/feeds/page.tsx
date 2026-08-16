"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { cameras, getEventLabel } from "@/lib/mock-data";
import { useDashboardStore } from "@/lib/store";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import {
  Camera,
  Maximize2,
  Minimize2,
  Radio,
  Sliders,
  Sparkles,
  Shield,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Zap,
  Activity,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveFeedsPage() {
  useSimulatedSocket();
  const [selectedCam, setSelectedCam] = useState<string>("all");
  const [gridMode, setGridMode] = useState<"2x2" | "single" | "3x3">("2x2");
  const [showOverlays, setShowOverlays] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeInspectedCam, setActiveInspectedCam] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayedCameras =
    selectedCam === "all" ? cameras : cameras.filter((c) => c.id === selectedCam);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6E8EC] dashboard-theme selection:bg-[#7342E2] selection:text-white">
      {/* ══ Cylinder Glassmorphism Navbar (Dark Variant) ═══════════════ */}
      <div className="pt-3 pb-2">
        <Navbar variant="glass-dark" />
      </div>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* ══ Top Toolbar & Control Bar ═════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12151C] border border-[#232733] shadow-lg">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold font-heading text-[#E6E8EC]">
                Nagpur CCTV Live Video Matrix
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                4/4 CAMERAS ONLINE
              </span>
            </div>
            <p className="text-xs text-[#8B93A3]">
              Real-time multi-camera edge stream analysis with sub-45ms YOLOv8 inference
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Camera Filter Pill */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#181C25] border border-[#232733]">
              <button
                onClick={() => setSelectedCam("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCam === "all"
                    ? "bg-[#7342E2] text-white shadow-sm"
                    : "text-[#8B93A3] hover:text-white"
                }`}
              >
                All Junctions
              </button>
              {cameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCam(cam.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCam === cam.id
                      ? "bg-[#7342E2] text-white shadow-sm"
                      : "text-[#8B93A3] hover:text-white"
                  }`}
                >
                  {cam.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* AI Toggle Pills */}
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                showOverlays
                  ? "bg-[#7342E2]/15 text-[#7342E2] border-[#7342E2]/40"
                  : "bg-[#181C25] text-[#8B93A3] border-[#232733] hover:text-white"
              }`}
            >
              <Sparkles size={13} />
              <span>AI Bounding Boxes: {showOverlays ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setShowZones(!showZones)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                showZones
                  ? "bg-blue-500/15 text-blue-400 border-blue-500/40"
                  : "bg-[#181C25] text-[#8B93A3] border-[#232733] hover:text-white"
              }`}
            >
              <Layers size={13} />
              <span>Zones: {showZones ? "ON" : "OFF"}</span>
            </button>

            {/* Grid Layout Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#181C25] border border-[#232733]">
              {(["2x2", "single"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setGridMode(mode)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono-data uppercase transition-all ${
                    gridMode === mode
                      ? "bg-white/15 text-white"
                      : "text-[#8B93A3] hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Camera Feeds Grid ═════════════════════════════════════════ */}
        <div
          className={`grid gap-4 ${
            gridMode === "single" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {displayedCameras.map((camera, index) => {
            return (
              <motion.div
                key={camera.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden bg-[#12151C] border border-[#232733] hover:border-[#7342E2]/60 hover:shadow-[0_0_24px_rgba(115,66,226,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#181C25]/90 border-b border-[#232733]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {camera.name}
                      </span>
                      <span className="text-[10px] font-mono-data text-[#8B93A3]">
                        {camera.id} · Lat: {camera.location.lat.toFixed(4)}, Lng: {camera.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LIVE · {camera.fps} FPS
                    </span>
                    <button
                      onClick={() => setActiveInspectedCam(camera.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8B93A3] hover:text-white transition-colors cursor-pointer"
                      title="Inspect camera feed"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Video / SVG Canvas Area */}
                <div className="relative aspect-video bg-[#07090E] overflow-hidden flex items-center justify-center">
                  <svg
                    viewBox="0 0 640 360"
                    className="w-full h-full object-cover"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid pattern */}
                    <defs>
                      <pattern
                        id={`grid-pat-${camera.id}`}
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          stroke="rgba(255,255,255,0.025)"
                          strokeWidth="1"
                        />
                      </pattern>
                      <linearGradient id={`poly-grad-${camera.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7342E2" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#0084FF" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <rect width="640" height="360" fill={`url(#grid-pat-${camera.id})`} />

                    {/* Road perspectives simulation */}
                    <path
                      d="M 0 360 L 260 140 L 380 140 L 640 360 Z"
                      fill="rgba(255,255,255,0.015)"
                    />
                    <line x1="320" y1="140" x2="320" y2="360" stroke="rgba(255,255,255,0.06)" strokeDasharray="10 8" />

                    {/* Zone Overlay */}
                    {showZones && (
                      <g>
                        <polygon
                          points="70,110 240,90 260,270 50,290"
                          fill={`url(#poly-grad-${camera.id})`}
                          stroke="#7342E2"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                        />
                        <text
                          x="95"
                          y="190"
                          fill="#7342E2"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          letterSpacing="1"
                        >
                          [ZONE: NO_PARKING]
                        </text>
                      </g>
                    )}

                    {/* AI Bounding Boxes */}
                    {showOverlays && (
                      <g>
                        {/* Vehicle 1 */}
                        <rect
                          x="310"
                          y="150"
                          width="130"
                          height="85"
                          fill="none"
                          stroke="#FF4D4F"
                          strokeWidth="2"
                          rx="4"
                        />
                        <rect x="310" y="132" width="165" height="18" fill="rgba(255,77,79,0.9)" rx="3" />
                        <text x="316" y="145" fill="white" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                          Vehicle #142 · Stopped 34s
                        </text>

                        {/* Vehicle 2 */}
                        <rect
                          x="160"
                          y="180"
                          width="110"
                          height="75"
                          fill="none"
                          stroke="#3DD68C"
                          strokeWidth="1.5"
                          rx="4"
                        />
                        <rect x="160" y="165" width="140" height="15" fill="rgba(61,214,140,0.85)" rx="2" />
                        <text x="165" y="176" fill="#0B0E14" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          Vehicle #208 · 42 km/h
                        </text>

                        {/* Pedestrian */}
                        <rect
                          x="480"
                          y="160"
                          width="45"
                          height="90"
                          fill="none"
                          stroke="#0084FF"
                          strokeWidth="1.5"
                          rx="3"
                        />
                        <rect x="480" y="147" width="90" height="13" fill="rgba(0,132,255,0.85)" rx="2" />
                        <text x="484" y="156" fill="white" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                          Person #89
                        </text>
                      </g>
                    )}

                    {/* Telemetry OSD */}
                    <text x="14" y="24" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">
                      NAGPUR_CCTV_EDGE_NODE // {camera.name.toUpperCase()}
                    </text>
                    <text x="14" y="348" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">
                      REC ● {currentTime || "12:00:00"} IST · H.264 @ 4096 Kbps
                    </text>
                  </svg>

                  {/* Corner Accent Overlays */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-black/60 backdrop-blur-md text-[#8B93A3] border border-white/10">
                      Inference: 38ms
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-black/60 backdrop-blur-md text-[#8B93A3] border border-white/10">
                      1080p
                    </span>
                  </div>
                </div>

                {/* Footer Controls & Stats */}
                <div className="px-4 py-2.5 bg-[#181C25]/60 border-t border-[#232733] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-[#8B93A3] text-[11px] font-mono-data">
                    <span>Vehicles: <strong className="text-white">18</strong></span>
                    <span>Pedestrians: <strong className="text-white">6</strong></span>
                    <span>Density: <strong className="text-[#3DD68C]">Normal</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Captured snapshot frame from ${camera.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Snapshot
                    </button>
                    <button
                      onClick={() => alert(`Triggered manual alert for ${camera.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium border border-red-500/20 transition-colors cursor-pointer"
                    >
                      Flag Incident
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ══ Inspection Modal / Fullscreen ═══════════════════════════════ */}
      <AnimatePresence>
        {activeInspectedCam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveInspectedCam(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-5xl rounded-2xl bg-[#12151C] border border-[#232733] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#232733]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-base font-bold text-white">
                    {cameras.find((c) => c.id === activeInspectedCam)?.name} — Deep Stream Inspector
                  </h2>
                </div>
                <button
                  onClick={() => setActiveInspectedCam(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  <Minimize2 size={16} />
                </button>
              </div>

              <div className="p-6">
                <div className="aspect-video bg-[#07090E] rounded-xl overflow-hidden border border-[#232733] flex items-center justify-center relative">
                  <p className="text-sm font-mono-data text-[#8B93A3]">
                    Live 60 FPS Ultra-HD Stream Pipeline Active
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[#181C25] border border-[#232733]">
                    <span className="text-[10px] text-[#8B93A3] block uppercase">Resolution</span>
                    <span className="text-sm font-bold font-mono-data text-white">1920 × 1080 @ 30fps</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181C25] border border-[#232733]">
                    <span className="text-[10px] text-[#8B93A3] block uppercase">Model Pipeline</span>
                    <span className="text-sm font-bold font-mono-data text-[#7342E2]">YOLOv8n + ByteTrack</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181C25] border border-[#232733]">
                    <span className="text-[10px] text-[#8B93A3] block uppercase">Network Latency</span>
                    <span className="text-sm font-bold font-mono-data text-[#3DD68C]">24ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181C25] border border-[#232733]">
                    <span className="text-[10px] text-[#8B93A3] block uppercase">Encoding</span>
                    <span className="text-sm font-bold font-mono-data text-white">H.265 / HEVC</span>
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
