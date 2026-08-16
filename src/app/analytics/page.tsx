"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { useDashboardStore } from "@/lib/store";
import { cameras } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Download,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function AnalyticsPage() {
  const dailyStats = useDashboardStore((s) => s.dailyStats);
  const [selectedCamera, setSelectedCamera] = useState("all");
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d">("7d");

  // Summary Metrics calculation
  const totalAlerts = useMemo(() => {
    const relevant =
      selectedCamera === "all"
        ? dailyStats
        : dailyStats.filter((s) => s.cameraId === selectedCamera);
    return relevant.reduce((sum, s) => sum + s.totalAlerts, 0);
  }, [dailyStats, selectedCamera]);

  const avgLatency = useMemo(() => {
    const relevant =
      selectedCamera === "all"
        ? dailyStats
        : dailyStats.filter((s) => s.cameraId === selectedCamera);
    if (!relevant.length) return 0;
    return (
      relevant.reduce((sum, s) => sum + s.avgLatencyMs, 0) / relevant.length
    );
  }, [dailyStats, selectedCamera]);

  // Hourly traffic & non-helmet infraction density
  const hourlyData = useMemo(() => {
    const data = [];
    for (let h = 0; h < 24; h++) {
      const isPeak = h >= 8 && h <= 21;
      const singleRider = isPeak ? Math.floor(Math.random() * 8 + 4) : Math.floor(Math.random() * 2 + 1);
      const doubleRider = isPeak ? Math.floor(Math.random() * 5 + 2) : Math.floor(Math.random() * 2);
      const tripleRider = isPeak ? Math.floor(Math.random() * 3 + 1) : 0;
      data.push({
        hour: `${h.toString().padStart(2, "0")}:00`,
        "Single Rider No-Helmet": singleRider,
        "Double Rider No-Helmet": doubleRider,
        "Triple Riding No-Helmet": tripleRider,
        total: singleRider + doubleRider + tripleRider,
      });
    }
    return data;
  }, []);

  // 7-day trend data
  const trendData = useMemo(() => {
    const dates = [...new Set(dailyStats.map((s) => s.date))].sort();
    return dates.map((date) => {
      const entry: Record<string, string | number> = { date: date.slice(5) };
      cameras.forEach((cam) => {
        const stat = dailyStats.find((s) => s.date === date && s.cameraId === cam.id);
        entry[cam.name] = stat?.totalAlerts || 0;
      });
      return entry;
    });
  }, [dailyStats]);

  const lineColors = ["#7342E2", "#FF3B30", "#F5A623", "#10B981"];

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
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] rounded-full bg-[#FF3B30]/8 blur-[140px]" />
      </div>

      {/* ══ Cylinder Glassmorphism Navbar ══════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* ══ Header & Export Toolbar ═══════════════════════════════════ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-[#192837]">
                Nagpur Non-Helmet Violation Analytics &amp; Safety Intelligence
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono-data bg-red-500/15 text-red-700 border border-red-500/30 backdrop-blur-md font-bold">
                YOLOv8 + VGG16
              </span>
            </div>
            <p className="text-xs text-[#5A6B7C] mt-0.5">
              Deep machine learning telemetry on protective headgear compliance and Section 194D e-Challan volume
            </p>
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/50 backdrop-blur-xl border border-white/70 shadow-sm">
              {(["today", "7d", "30d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-[#7342E2] text-white shadow-md"
                      : "text-[#192837]/80 hover:text-[#192837] hover:bg-white/60"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Junction Selector */}
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white/60 backdrop-blur-xl border border-white/80 text-[#192837] outline-none cursor-pointer shadow-sm"
            >
              <option value="all">All Nagpur Checkpoints</option>
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.name}
                </option>
              ))}
            </select>

            {/* Export Buttons */}
            <button
              onClick={() => alert("Generating Nagpur Non-Helmet Enforcement & Fine Dossier PDF...")}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* ══ 4 KPI Cards Grid ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5A6B7C] uppercase tracking-wider block">
                  Total Non-Helmet Cases
                </span>
                <span className="text-2xl font-bold font-mono-data text-red-600 mt-1 block">
                  {totalAlerts}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 text-red-600 border border-red-500/25 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/[0.06] text-[11px] text-[#5A6B7C]">
              <span className="text-emerald-700 font-bold">+16.8%</span> detection sensitivity
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5A6B7C] uppercase tracking-wider block">
                  VGG16 Model Accuracy
                </span>
                <span className="text-2xl font-bold font-mono-data text-[#7342E2] mt-1 block">
                  97.4%
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#7342E2]/15 text-[#7342E2] border border-[#7342E2]/25 flex items-center justify-center">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/[0.06] text-[11px] text-[#5A6B7C]">
              Trained on Roboflow &amp; custom head datasets
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5A6B7C] uppercase tracking-wider block">
                  ANPR Plate Read Rate
                </span>
                <span className="text-2xl font-bold font-mono-data text-emerald-700 mt-1 block">
                  95.8%
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/[0.06] text-[11px] text-[#5A6B7C]">
              Automated RTO vehicle lookup
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5A6B7C] uppercase tracking-wider block">
                  Inference Latency
                </span>
                <span className="text-2xl font-bold font-mono-data text-[#192837] mt-1 block">
                  {(avgLatency / 1000).toFixed(2)}s
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-black/[0.05] text-[#192837] border border-black/[0.08] flex items-center justify-center">
                <Zap size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/[0.06] text-[11px] text-[#5A6B7C]">
              Real-time SMS challan dispatch under 2s
            </div>
          </div>
        </div>

        {/* ══ Visual Charts Grid ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Hourly Breakdown */}
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#192837]">
                  Hourly Non-Helmet Distribution (24h)
                </h3>
                <p className="text-xs text-[#5A6B7C]">
                  Single, double, and triple riding infractions by time of day
                </p>
              </div>
              <span className="text-xs font-mono-data text-red-600 font-bold">VGG16 Stream</span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid stroke="rgba(25,40,55,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fill: "#5A6B7C", fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fill: "#5A6B7C", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.9)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(25,40,55,0.12)",
                      color: "#192837",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#5A6B7C" }} />
                  <Bar dataKey="Single Rider No-Helmet" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Double Rider No-Helmet" fill="#FF9500" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Triple Riding No-Helmet" fill="#7342E2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: 7-Day Trend */}
          <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#192837]">
                  7-Day Non-Helmet Infraction Trend Across Junctions
                </h3>
                <p className="text-xs text-[#5A6B7C]">
                  Comparative timeline of camera checkpoint activity
                </p>
              </div>
              <span className="text-xs font-mono-data text-emerald-700 font-bold">Live Sync</span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke="rgba(25,40,55,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#5A6B7C", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#5A6B7C", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.9)",
                      borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(25,40,55,0.12)",
                      color: "#192837",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#5A6B7C" }} />
                  {cameras.map((cam, i) => (
                    <Line
                      key={cam.id}
                      type="monotone"
                      dataKey={cam.name}
                      stroke={lineColors[i]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ══ Junction Safety Scorecard Table ════════════════════════════ */}
        <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#192837]">
                Nagpur Two-Wheeler Helmet Compliance Scorecard
              </h3>
              <p className="text-xs text-[#5A6B7C]">
                Aggregated compliance ratings and Section 194D penalty issuance by monitoring checkpoint
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black/[0.08] text-[#5A6B7C]">
                  <th className="text-left py-3 px-4 font-bold uppercase">Checkpoint Node</th>
                  <th className="text-left py-3 px-4 font-bold uppercase">No-Helmet Detected (7d)</th>
                  <th className="text-left py-3 px-4 font-bold uppercase">Fines Imposed</th>
                  <th className="text-left py-3 px-4 font-bold uppercase">VGG16 Conf</th>
                  <th className="text-left py-3 px-4 font-bold uppercase">Compliance Score</th>
                  <th className="text-left py-3 px-4 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {cameras.map((cam, idx) => {
                  const complianceScore = 91 + idx * 2;
                  const cases = 42 + idx * 11;
                  const fine = cases * 1200;
                  return (
                    <tr key={cam.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#192837] block">{cam.name}</span>
                        <span className="text-[10px] font-mono-data text-[#5A6B7C]">{cam.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-data font-bold text-red-600">
                        {cases} Violations
                      </td>
                      <td className="py-3.5 px-4 font-mono-data font-bold text-[#7342E2]">
                        ₹{fine.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 font-mono-data font-bold text-emerald-700">
                        {(96.2 + idx * 0.8).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-black/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#7342E2]"
                              style={{ width: `${complianceScore}%` }}
                            />
                          </div>
                          <span className="font-mono-data font-bold text-[#192837]">{complianceScore}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Optimal
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
