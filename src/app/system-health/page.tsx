"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import {
  Cpu,
  Activity,
  HardDrive,
  Wifi,
  ShieldCheck,
  Server,
  Zap,
  RefreshCw,
  Terminal,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

function RadialMetric({
  value,
  label,
  sublabel,
  color,
}: {
  value: number;
  label: string;
  sublabel: string;
  color: string;
}) {
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="55"
            cy="55"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono-data text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-bold text-white mt-2 block">{label}</span>
      <span className="text-[10px] text-[#8B93A3] font-mono-data">{sublabel}</span>
    </div>
  );
}

const mockSystemLogs = [
  "[CUDA_ENGINE] TensorRT runtime executing YOLOv8n_FP16 kernel on GPU-0 (Nagpur-Edge-A)",
  "[RTSP_INGEST] Stream CAM-001 (Wardha Rd) decoded at 1920x1080@30fps (Keyframe interval: 2.0s)",
  "[TRACKER] ByteTrack active tracks: 24 vehicles, 12 pedestrians in junction perimeter",
  "[ANOMALY_DETECTOR] Vehicle #142 exceed dwell threshold (34s in No-Parking Zone) -> Dispatched ALT-108",
  "[NETWORK] RTSP bandwidth 16.4 Mbps across 4 streams | Zero dropped frames",
  "[HEALTH_PROBE] Edge node latency: 22ms | CPU Temp: 48°C | GPU Temp: 54°C | Status: OPTIMAL",
];

export default function SystemHealthPage() {
  const [logs, setLogs] = useState(mockSystemLogs);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
      const newLog = `[${time}] [AI_PIPELINE] Processed batch 4x1080p in 38.2ms | Memory: 3.4GB / 16GB VRAM`;
      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#07090E] text-[#E6E8EC] overflow-x-hidden selection:bg-[#7342E2] selection:text-white">
      {/* ══ Ambient Glowing Glass Backdrops ════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/3 w-[600px] h-[600px] rounded-full bg-[#3DD68C]/12 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] rounded-full bg-[#7342E2]/15 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-[#0084FF]/10 blur-[160px]" />
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
        {/* ══ Header ════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-white">
                Edge AI Inference Engine &amp; System Health
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM OPTIMAL (99.98% UPTIME)
              </span>
            </div>
            <p className="text-xs text-[#8B93A3] mt-0.5">
              Live hardware telemetry for NVIDIA Jetson AGX &amp; RTX inference nodes powering Nagpur CCTV AI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Re-syncing AI inference cluster...")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Sync Nodes</span>
            </button>
          </div>
        </div>

        {/* ══ 3 Radial Gauges Grid ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center text-center">
            <RadialMetric
              value={68}
              label="GPU Cluster Load"
              sublabel="NVIDIA TensorRT / CUDA"
              color="#7342E2"
            />
            <div className="w-full mt-2 pt-3 border-t border-white/[0.08] flex justify-between text-xs text-[#8B93A3]">
              <span>VRAM: <strong className="text-white">6.2 / 16 GB</strong></span>
              <span>Temp: <strong className="text-emerald-400">54°C</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center text-center">
            <RadialMetric
              value={42}
              label="CPU Multi-Core Load"
              sublabel="AMD EPYC 16-Core Node"
              color="#0084FF"
            />
            <div className="w-full mt-2 pt-3 border-t border-white/[0.08] flex justify-between text-xs text-[#8B93A3]">
              <span>RAM: <strong className="text-white">14.8 / 64 GB</strong></span>
              <span>Temp: <strong className="text-emerald-400">48°C</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center text-center">
            <RadialMetric
              value={99}
              label="Network & Stream Health"
              sublabel="RTSP Pipeline Stream Health"
              color="#3DD68C"
            />
            <div className="w-full mt-2 pt-3 border-t border-white/[0.08] flex justify-between text-xs text-[#8B93A3]">
              <span>Bandwidth: <strong className="text-white">18.4 Mbps</strong></span>
              <span>Loss: <strong className="text-emerald-400">0.00%</strong></span>
            </div>
          </div>
        </div>

        {/* ══ AI Model Registry & Node Health ════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Models Table */}
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Active AI Models &amp; Accelerators</h3>
                <p className="text-xs text-[#8B93A3]">Deployed neural networks in production loop</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-[#7342E2]/15 text-[#c2a4ff] border border-[#7342E2]/30">
                TensorRT 8.6
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  name: "YOLOv8n-Nagpur-CCTV",
                  task: "Vehicle & Pedestrian Bounding Boxes",
                  precision: "FP16 (TensorRT)",
                  latency: "12.4ms",
                  status: "Online",
                },
                {
                  name: "ByteTrack-MultiTarget-v2",
                  task: "Spatial Dwell & Trajectory Tracker",
                  precision: "C++ Native / CUDA",
                  latency: "8.1ms",
                  status: "Online",
                },
                {
                  name: "CrowdDensity-ResNet34",
                  task: "Sitabuldi Market Surge Estimation",
                  precision: "INT8 Quantized",
                  latency: "18.2ms",
                  status: "Online",
                },
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8B93A3]">{m.task}</div>
                  <div className="flex items-center gap-4 text-[10px] font-mono-data pt-1 text-[#8B93A3]">
                    <span>Precision: <strong className="text-white">{m.precision}</strong></span>
                    <span>Inference: <strong className="text-[#3DD68C]">{m.latency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Diagnostic Terminal */}
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Terminal size={16} className="text-[#c2a4ff]" />
                  <span>Real-Time Edge Engine Diagnostics Log</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-[#05070B]/90 border border-white/10 font-mono-data text-[11px] text-[#8B93A3] space-y-2 h-[260px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#7342E2] flex-shrink-0">&gt;</span>
                    <span className="text-[#E6E8EC]/90 leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#8B93A3]">
              <span>Socket: <strong className="text-emerald-400">wss://edge-cluster.nagpur.gov.in</strong></span>
              <span>Buffer: <strong className="text-white">64 KB</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
