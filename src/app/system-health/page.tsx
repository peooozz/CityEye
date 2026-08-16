"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import {
  RefreshCw,
  Terminal,
  ShieldAlert,
} from "lucide-react";

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
          <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(25,40,55,0.08)" strokeWidth="8" />
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
          <span className="text-xl font-bold font-mono-data text-[#192837]">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-bold text-[#192837] mt-2 block">{label}</span>
      <span className="text-[10px] text-[#5A6B7C] font-mono-data">{sublabel}</span>
    </div>
  );
}

const mockSystemLogs = [
  "[YOLO_ENGINE] YOLOv8n runtime localizing motorcycles on Stream CAM-001 (Wardha Rd)",
  "[VGG16_CLASSIFIER] Cropped upper 30% head ROI (224x224x3) -> Prediction: Without_Helmet (Conf: 96.8%)",
  "[ANPR_OCR] License Plate localized -> VGG16 Character OCR read 'MH31BK4091' (Conf: 95.4%)",
  "[FINE_DISPATCH] Section 194D e-Challan ₹1,000 generated -> SMS API Dispatched",
  "[RTSP_INGEST] Stream decoded at 1920x1080@30fps (Keyframe interval: 2.0s)",
  "[HEALTH_PROBE] Edge node latency: 18.2ms | GPU Temp: 52°C | Status: OPTIMAL",
];

export default function SystemHealthPage() {
  const [logs, setLogs] = useState(mockSystemLogs);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
      const newLog = `[${time}] [YOLO+VGG16] Processed batch 4x1080p in 18.4ms | VGG16 Helmet Head Ingestion: 24 Tracks`;
      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="absolute -top-40 right-1/3 w-[600px] h-[600px] rounded-full bg-[#3DD68C]/10 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] rounded-full bg-[#FF3B30]/8 blur-[140px]" />
      </div>

      {/* ══ Cylinder Glassmorphism Navbar ══════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* ══ Header ════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-[#192837]">
                YOLOv8 + VGG16 Edge Engine Telemetry
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-data bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                SYSTEM OPTIMAL (99.98% UPTIME)
              </span>
            </div>
            <p className="text-xs text-[#5A6B7C] mt-0.5">
              Live hardware telemetry for NVIDIA Jetson AGX &amp; RTX inference nodes executing the ThanhSan97 Multi-Stage Pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Re-syncing YOLO + VGG16 model weights...")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/60 hover:bg-white text-[#192837] border border-white/80 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Sync Weights</span>
            </button>
          </div>
        </div>

        {/* ══ 3 Radial Gauges Grid ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col items-center text-center">
            <RadialMetric
              value={64}
              label="GPU Cluster Load"
              sublabel="TensorRT FP16 / CUDA"
              color="#7342E2"
            />
            <div className="w-full mt-2 pt-3 border-t border-black/[0.06] flex justify-between text-xs text-[#5A6B7C]">
              <span>VRAM: <strong className="text-[#192837]">5.4 / 16 GB</strong></span>
              <span>Temp: <strong className="text-emerald-700 font-bold">52°C</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col items-center text-center">
            <RadialMetric
              value={38}
              label="CPU Multi-Core Load"
              sublabel="AMD EPYC 16-Core Node"
              color="#0084FF"
            />
            <div className="w-full mt-2 pt-3 border-t border-black/[0.06] flex justify-between text-xs text-[#5A6B7C]">
              <span>RAM: <strong className="text-[#192837]">12.2 / 64 GB</strong></span>
              <span>Temp: <strong className="text-emerald-700 font-bold">46°C</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col items-center text-center">
            <RadialMetric
              value={99}
              label="Network & Stream Health"
              sublabel="RTSP Pipeline Stream Health"
              color="#10B981"
            />
            <div className="w-full mt-2 pt-3 border-t border-black/[0.06] flex justify-between text-xs text-[#5A6B7C]">
              <span>Bandwidth: <strong className="text-[#192837]">16.8 Mbps</strong></span>
              <span>Loss: <strong className="text-emerald-700 font-bold">0.00%</strong></span>
            </div>
          </div>
        </div>

        {/* ══ AI Model Registry & Node Health ════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Models Table */}
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#192837]">ThanhSan97 Multi-Model Registry</h3>
                <p className="text-xs text-[#5A6B7C]">Deployed neural networks in live inference loop</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-[#7342E2]/15 text-[#7342E2] border border-[#7342E2]/30 font-bold">
                PyTorch 2.3 + TensorRT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  name: "Moto_Detect_Model (YOLOv8n)",
                  task: "Stage 1: Two-Wheeler & Rider Localization",
                  precision: "FP16 (TensorRT)",
                  latency: "8.4ms",
                  status: "Online",
                },
                {
                  name: "Helmet_Classifier_Model (VGG16)",
                  task: "Stage 2: Head-Crop ROI Binary Classifier",
                  precision: "PyTorch Deep CNN",
                  latency: "6.2ms",
                  status: "Online",
                },
                {
                  name: "ReadLP_OCR_Model (VGG16)",
                  task: "Stage 3: License Plate Character Recognizer",
                  precision: "Contour + VGG16 OCR",
                  latency: "4.8ms",
                  status: "Online",
                },
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#192837]">{m.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/30">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5A6B7C]">{m.task}</div>
                  <div className="flex items-center gap-4 text-[10px] font-mono-data pt-1 text-[#5A6B7C]">
                    <span>Precision: <strong className="text-[#192837]">{m.precision}</strong></span>
                    <span>Inference: <strong className="text-emerald-700">{m.latency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Diagnostic Terminal */}
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#192837] font-bold text-sm">
                  <Terminal size={16} className="text-[#7342E2]" />
                  <span>Real-Time YOLOv8 + VGG16 Diagnostics Log</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-[#0C121E] border border-white/30 font-mono-data text-[11px] text-white/80 space-y-2 h-[260px] overflow-y-auto shadow-inner">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#7342E2] font-bold flex-shrink-0">&gt;</span>
                    <span className="text-white/90 leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#5A6B7C]">
              <span>Socket: <strong className="text-emerald-700 font-bold">wss://helmet-ai.nagpur.gov.in</strong></span>
              <span>Buffer: <strong className="text-[#192837]">64 KB</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
