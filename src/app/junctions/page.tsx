"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Camera } from "@/lib/types";
import {
  Plus,
  Edit3,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExtendedJunction extends Camera {
  ipAddress: string;
  hardwareModel: string;
  activeZone: string;
  totalLanes: number;
  coverageAngle: string;
  dailyTrafficEstimate: string;
}

const junctionsData: ExtendedJunction[] = [
  {
    id: "CAM-001",
    name: "Wardha Road Checkpoint",
    location: { lat: 21.1256, lng: 79.0725 },
    status: "online",
    fps: 30,
    ipAddress: "192.168.10.101",
    hardwareModel: "Hikvision DS-2CD2386G2-ISU/SL (4K Optical)",
    activeZone: "Two-Wheeler Helmet & Speed Enforcement Zone",
    totalLanes: 6,
    coverageAngle: "120° Wide-Angle Pan",
    dailyTrafficEstimate: "42,000+ Motorcycles",
  },
  {
    id: "CAM-002",
    name: "Sitabuldi Square",
    location: { lat: 21.1458, lng: 79.0882 },
    status: "online",
    fps: 25,
    ipAddress: "192.168.10.102",
    hardwareModel: "Axis Q1656-LE (8MP AI Object Detection)",
    activeZone: "Metro Plaza Two-Wheeler Ingress Corridor",
    totalLanes: 4,
    coverageAngle: "180° Panoramic Multi-Sensor",
    dailyTrafficEstimate: "58,000+ Two-Wheelers",
  },
  {
    id: "CAM-003",
    name: "Dharampeth Circle",
    location: { lat: 21.1432, lng: 79.0652 },
    status: "online",
    fps: 30,
    ipAddress: "192.168.10.103",
    hardwareModel: "Dahua WizMind IPC-HFW7842H-Z (Ultra AI)",
    activeZone: "Rotary Two-Wheeler Safety Checkpoint",
    totalLanes: 4,
    coverageAngle: "95° Fixed High-Density Corridor",
    dailyTrafficEstimate: "32,000+ Motorcycles",
  },
  {
    id: "CAM-004",
    name: "Ambazari Lake Road",
    location: { lat: 21.1349, lng: 79.0498 },
    status: "online",
    fps: 28,
    ipAddress: "192.168.10.104",
    hardwareModel: "Bosch FLEXIDOME IP starlight 8000i",
    activeZone: "Waterfront Boulevard Two-Wheeler Patrol",
    totalLanes: 4,
    coverageAngle: "110° Low-Light Starlight Sensor",
    dailyTrafficEstimate: "24,000+ Two-Wheelers",
  },
];

export default function JunctionsPage() {
  const [selectedJunction, setSelectedJunction] = useState<ExtendedJunction>(junctionsData[0]);
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#7342E2]/10 blur-[130px]" />
        <div className="absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full bg-[#FF3B30]/8 blur-[140px]" />
      </div>

      {/* ══ Cylinder Glassmorphism Navbar ══════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* ══ Header Toolbar ════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-[#192837]">
                Nagpur Helmet Enforcement Checkpoints
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-data bg-red-500/15 text-red-700 border border-red-500/30 backdrop-blur-md font-bold flex items-center gap-1">
                <ShieldAlert size={12} />
                4 Active AI Checkpoints
              </span>
            </div>
            <p className="text-xs text-[#5A6B7C] mt-0.5">
              Geospatial placement, VGG16 head-crop calibration, and RTSP stream controls for Nagpur Smart Mobility
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Checkpoint Node</span>
          </button>
        </div>

        {/* ══ Main Two-Column Layout ═════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Checkpoint Selection Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5A6B7C] px-1">
              Select Checkpoint Node to Calibrate
            </h2>

            <div className="space-y-3">
              {junctionsData.map((j) => {
                const isSelected = selectedJunction.id === j.id;
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJunction(j)}
                    className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer backdrop-blur-3xl ${
                      isSelected
                        ? "bg-white/80 border-[#7342E2] shadow-[0_8px_32px_rgba(115,66,226,0.18),inset_0_1px_2px_rgba(255,255,255,1)]"
                        : "bg-white/40 border-white/80 hover:border-[#7342E2]/40 hover:bg-white/60 shadow-[0_8px_32px_rgba(25,40,55,0.04)]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            j.status === "online" ? "bg-emerald-500" : "bg-red-500"
                          } animate-pulse`}
                        />
                        <div>
                          <h3 className="font-bold text-sm text-[#192837]">{j.name}</h3>
                          <span className="text-[10px] font-mono-data text-[#5A6B7C]">
                            {j.id} · {j.ipAddress}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 font-bold">
                        {j.fps} FPS
                      </span>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#5A6B7C]">
                      <span>{j.totalLanes} Lanes</span>
                      <span className="font-mono-data text-[#192837] font-bold">{j.dailyTrafficEstimate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Detailed Telemetry & Zone Calibration (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-6">
              {/* Header with Coordinates */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-black/[0.08] gap-2">
                <div>
                  <span className="text-xs font-mono-data text-[#7342E2] font-bold block">
                    ACTIVE CHECKPOINT CALIBRATION
                  </span>
                  <h2 className="text-lg font-bold font-heading text-[#192837] mt-0.5">
                    {selectedJunction.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingZone(!isEditingZone)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-xl transition-all cursor-pointer ${
                      isEditingZone
                        ? "bg-[#7342E2] text-white border-[#7342E2] shadow-md"
                        : "bg-white/70 text-[#192837] border-white/80 hover:bg-white shadow-sm"
                    }`}
                  >
                    <Edit3 size={13} />
                    <span>{isEditingZone ? "Save Calibration" : "Calibrate Head ROI"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive SVG Zone Calibration Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0C121E] border border-white/40 shadow-inner">
                <svg viewBox="0 0 640 360" className="w-full h-full object-cover">
                  <defs>
                    <pattern id="calib-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="640" height="360" fill="url(#calib-grid)" />

                  <polygon
                    points="80,100 280,80 320,290 60,310"
                    fill="rgba(255,59,48,0.2)"
                    stroke="#FF3B30"
                    strokeWidth={isEditingZone ? "3" : "2"}
                    strokeDasharray={isEditingZone ? "4 4" : "none"}
                  />
                  {isEditingZone && (
                    <g>
                      <circle cx="80" cy="100" r="6" fill="#FF3B30" stroke="white" strokeWidth="2" />
                      <circle cx="280" cy="80" r="6" fill="#FF3B30" stroke="white" strokeWidth="2" />
                      <circle cx="320" cy="290" r="6" fill="#FF3B30" stroke="white" strokeWidth="2" />
                      <circle cx="60" cy="310" r="6" fill="#FF3B30" stroke="white" strokeWidth="2" />
                    </g>
                  )}

                  <text x="110" y="200" fill="#FF8080" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    ZONE: {selectedJunction.activeZone.toUpperCase()}
                  </text>
                  <text x="14" y="24" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace">
                    HELMET DETECTION HUD // {selectedJunction.id} ({selectedJunction.location.lat.toFixed(4)}, {selectedJunction.location.lng.toFixed(4)})
                  </text>
                </svg>

                {isEditingZone && (
                  <div className="absolute top-3 right-3 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg animate-pulse">
                    Interactive Head-Crop ROI Editor Active
                  </div>
                )}
              </div>

              {/* Hardware & Stream Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-1 shadow-sm">
                  <span className="text-[#5A6B7C] text-[11px] block uppercase font-semibold">Camera Hardware</span>
                  <span className="font-bold text-[#192837] block">{selectedJunction.hardwareModel}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-1 shadow-sm">
                  <span className="text-[#5A6B7C] text-[11px] block uppercase font-semibold">Model Pipeline</span>
                  <span className="font-bold text-[#7342E2] block">YOLOv8 + VGG16 Two-Stage</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-1 shadow-sm">
                  <span className="text-[#5A6B7C] text-[11px] block uppercase font-semibold">RTSP Feed Endpoint</span>
                  <span className="font-mono-data text-[#7342E2] font-bold block truncate">
                    rtsp://admin:pass@{selectedJunction.ipAddress}:554/live/ch0
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-1 shadow-sm">
                  <span className="text-[#5A6B7C] text-[11px] block uppercase font-semibold">Two-Wheeler Volume</span>
                  <span className="font-bold text-emerald-700 block">{selectedJunction.dailyTrafficEstimate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Add Junction Modal ═════════════════════════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#192837]/40 backdrop-blur-xl"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-3xl border border-white p-6 space-y-4 shadow-2xl text-[#192837]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-base font-bold font-heading text-[#192837]">Add New Helmet Checkpoint Node</h2>
              <p className="text-xs text-[#5A6B7C]">
                Register a new municipal camera checkpoint into the YOLO + VGG16 inference cluster.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#5A6B7C] font-semibold block mb-1">Checkpoint Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mankapur Ring Road Checkpoint"
                    className="w-full p-3 rounded-2xl bg-white/70 border border-white text-[#192837] focus:outline-none focus:border-[#7342E2] focus:bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#5A6B7C] font-semibold block mb-1">Camera IP Address</label>
                  <input
                    type="text"
                    placeholder="192.168.10.105"
                    className="w-full p-3 rounded-2xl bg-white/70 border border-white text-[#192837] focus:outline-none focus:border-[#7342E2] focus:bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#5A6B7C] font-semibold block mb-1">Inference Engine</label>
                  <select className="w-full p-3 rounded-2xl bg-white/70 border border-white text-[#192837] focus:outline-none focus:border-[#7342E2] focus:bg-white shadow-sm">
                    <option>YOLOv8 Motorcycle + VGG16 Head-Crop (Recommended)</option>
                    <option>YOLOv8 + VGG16 + ANPR Plate OCR</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[#192837] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("New helmet checkpoint node registered successfully!");
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#7342E2] hover:bg-[#6434d3] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Register Checkpoint
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
