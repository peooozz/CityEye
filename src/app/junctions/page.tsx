"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { cameras } from "@/lib/mock-data";
import { Camera } from "@/lib/types";
import {
  MapPin,
  Camera as CameraIcon,
  Plus,
  Radio,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  Edit3,
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
    name: "Wardha Road Junction",
    location: { lat: 21.1256, lng: 79.0725 },
    status: "online",
    fps: 30,
    ipAddress: "192.168.10.101",
    hardwareModel: "Hikvision DS-2CD2386G2-ISU/SL (4K PTZ)",
    activeZone: "No-Parking Corridor & Rapid Speed Enforcement",
    totalLanes: 6,
    coverageAngle: "120° Wide-Angle Pan",
    dailyTrafficEstimate: "64,000+ Vehicles",
  },
  {
    id: "CAM-002",
    name: "Sitabuldi Square",
    location: { lat: 21.1458, lng: 79.0882 },
    status: "online",
    fps: 25,
    ipAddress: "192.168.10.102",
    hardwareModel: "Axis Q1656-LE (8MP AI Object Detection)",
    activeZone: "Commercial Market Footpath & Pedestrian Safe-Zone",
    totalLanes: 4,
    coverageAngle: "180° Panoramic Multi-Sensor",
    dailyTrafficEstimate: "92,000+ Pedestrians & Vehicles",
  },
  {
    id: "CAM-003",
    name: "Dharampeth Circle",
    location: { lat: 21.1432, lng: 79.0652 },
    status: "online",
    fps: 30,
    ipAddress: "192.168.10.103",
    hardwareModel: "Dahua WizMind IPC-HFW7842H-Z (Ultra AI)",
    activeZone: "Wrong-Way Vehicle & Illegal U-Turn Perimeter",
    totalLanes: 4,
    coverageAngle: "95° Fixed High-Density Corridor",
    dailyTrafficEstimate: "48,000+ Vehicles",
  },
  {
    id: "CAM-004",
    name: "Ambazari Lake Road",
    location: { lat: 21.1349, lng: 79.0498 },
    status: "online",
    fps: 28,
    ipAddress: "192.168.10.104",
    hardwareModel: "Bosch FLEXIDOME IP starlight 8000i",
    activeZone: "Waterfront Boulevard Speed & Perimeter Safety",
    totalLanes: 4,
    coverageAngle: "110° Low-Light Starlight Sensor",
    dailyTrafficEstimate: "35,000+ Vehicles",
  },
];

export default function JunctionsPage() {
  const [selectedJunction, setSelectedJunction] = useState<ExtendedJunction>(junctionsData[0]);
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#07090E] text-[#E6E8EC] overflow-x-hidden selection:bg-[#7342E2] selection:text-white">
      {/* ══ Ambient Glowing Glass Backdrops ════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#7342E2]/15 blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full bg-[#0084FF]/12 blur-[150px]" />
        <div className="absolute -bottom-40 right-1/4 w-[650px] h-[650px] rounded-full bg-[#3DD68C]/10 blur-[160px]" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ══ Cylinder Glassmorphism Navbar ══════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-dark" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* ══ Header Toolbar ════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-white">
                Nagpur CCTV Junctions &amp; Node Infrastructure
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                4 Active Nodes
              </span>
            </div>
            <p className="text-xs text-[#8B93A3] mt-0.5">
              Geospatial placement, AI zone calibration, hardware specs, and RTSP stream controls for Nagpur Smart Mobility
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add New Node</span>
          </button>
        </div>

        {/* ══ Main Two-Column Layout ═════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Junctions Selection Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8B93A3] px-1">
              Select Junction Node to Inspect
            </h2>

            <div className="space-y-3">
              {junctionsData.map((j) => {
                const isSelected = selectedJunction.id === j.id;
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJunction(j)}
                    className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer backdrop-blur-2xl ${
                      isSelected
                        ? "bg-white/[0.08] border-[#7342E2] shadow-[0_8px_32px_rgba(115,66,226,0.25),inset_0_1px_2px_rgba(255,255,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 hover:border-[#7342E2]/40 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            j.status === "online" ? "bg-emerald-400" : "bg-red-400"
                          } animate-pulse`}
                        />
                        <div>
                          <h3 className="font-bold text-sm text-white">{j.name}</h3>
                          <span className="text-[10px] font-mono-data text-[#8B93A3]">
                            {j.id} · {j.ipAddress}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {j.fps} FPS
                      </span>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#8B93A3]">
                      <span>{j.totalLanes} Lanes</span>
                      <span className="font-mono-data text-white font-medium">{j.dailyTrafficEstimate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Detailed Telemetry & Zone Calibration (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-6">
              {/* Header with Coordinates */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                <div>
                  <span className="text-xs font-mono-data text-[#c2a4ff] block">
                    ACTIVE NODE CALIBRATION
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedJunction.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingZone(!isEditingZone)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition-all cursor-pointer ${
                      isEditingZone
                        ? "bg-[#7342E2] text-white border-[#7342E2] shadow-[0_2px_14px_rgba(115,66,226,0.4)]"
                        : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]"
                    }`}
                  >
                    <Edit3 size={13} />
                    <span>{isEditingZone ? "Save Polygon Zone" : "Calibrate Zone"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive SVG Zone Calibration Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#05070B]/90 border border-white/10">
                <svg viewBox="0 0 640 360" className="w-full h-full object-cover">
                  {/* Grid */}
                  <defs>
                    <pattern id="calib-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="640" height="360" fill="url(#calib-grid)" />

                  {/* Junction Geometry */}
                  <polygon
                    points="80,100 280,80 320,290 60,310"
                    fill="rgba(115,66,226,0.2)"
                    stroke="#7342E2"
                    strokeWidth={isEditingZone ? "3" : "2"}
                    strokeDasharray={isEditingZone ? "4 4" : "none"}
                  />
                  {isEditingZone && (
                    <g>
                      <circle cx="80" cy="100" r="6" fill="#7342E2" stroke="white" strokeWidth="2" />
                      <circle cx="280" cy="80" r="6" fill="#7342E2" stroke="white" strokeWidth="2" />
                      <circle cx="320" cy="290" r="6" fill="#7342E2" stroke="white" strokeWidth="2" />
                      <circle cx="60" cy="310" r="6" fill="#7342E2" stroke="white" strokeWidth="2" />
                    </g>
                  )}

                  <text x="110" y="200" fill="#c2a4ff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    ZONE: {selectedJunction.activeZone.toUpperCase()}
                  </text>
                  <text x="14" y="24" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
                    CALIBRATION HUD // {selectedJunction.id} ({selectedJunction.location.lat.toFixed(4)}, {selectedJunction.location.lng.toFixed(4)})
                  </text>
                </svg>

                {isEditingZone && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#7342E2] text-white text-xs font-semibold shadow-lg animate-pulse">
                    Interactive Zone Editor Mode Active
                  </div>
                )}
              </div>

              {/* Hardware & Stream Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1">
                  <span className="text-[#8B93A3] text-[11px] block uppercase">Camera Hardware</span>
                  <span className="font-semibold text-white block">{selectedJunction.hardwareModel}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1">
                  <span className="text-[#8B93A3] text-[11px] block uppercase">Lens Coverage</span>
                  <span className="font-semibold text-white block">{selectedJunction.coverageAngle}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1">
                  <span className="text-[#8B93A3] text-[11px] block uppercase">RTSP Feed Endpoint</span>
                  <span className="font-mono-data text-[#c2a4ff] block truncate">
                    rtsp://admin:pass@{selectedJunction.ipAddress}:554/live/ch0
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1">
                  <span className="text-[#8B93A3] text-[11px] block uppercase">Traffic Capacity</span>
                  <span className="font-semibold text-emerald-400 block">{selectedJunction.dailyTrafficEstimate}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-3xl bg-[#12151C]/90 backdrop-blur-3xl border border-white/15 p-6 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-base font-bold text-white">Add New Nagpur CCTV Node</h2>
              <p className="text-xs text-[#8B93A3]">
                Register a new municipal camera junction into the AI inference cluster.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#8B93A3] block mb-1">Junction Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mankapur Ring Road Junction"
                    className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
                <div>
                  <label className="text-[#8B93A3] block mb-1">Camera IP Address</label>
                  <input
                    type="text"
                    placeholder="192.168.10.105"
                    className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
                <div>
                  <label className="text-[#8B93A3] block mb-1">AI Detection Zone Type</label>
                  <select className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#7342E2]">
                    <option className="bg-[#12151C]">No Parking &amp; Tow Zone</option>
                    <option className="bg-[#12151C]">Speed Enforcement (60 km/h)</option>
                    <option className="bg-[#12151C]">Wrong Way Corridor</option>
                    <option className="bg-[#12151C]">Crowd Density &amp; Perimeter</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("New camera node registered successfully!");
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#7342E2] hover:bg-[#6434d3] text-white text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                >
                  Register Node
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
