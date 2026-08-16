"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { useDashboardStore } from "@/lib/store";
import { cameras, getEventLabel } from "@/lib/mock-data";
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
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Shield,
  Zap,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const dailyStats = useDashboardStore((s) => s.dailyStats);
  const alerts = useDashboardStore((s) => s.alerts);
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

  const resolvedPercentage = useMemo(() => {
    const relevant =
      selectedCamera === "all"
        ? dailyStats
        : dailyStats.filter((s) => s.cameraId === selectedCamera);
    if (!relevant.length) return 96.4;
    return (
      (relevant.reduce((sum, s) => sum + s.resolvedRate, 0) / relevant.length) * 100
    );
  }, [dailyStats, selectedCamera]);

  // Hourly traffic & alert density
  const hourlyData = useMemo(() => {
    const data = [];
    for (let h = 0; h < 24; h++) {
      const base = h >= 8 && h <= 20 ? Math.floor(Math.random() * 12 + 8) : Math.floor(Math.random() * 4 + 1);
      data.push({
        hour: `${h.toString().padStart(2, "0")}:00`,
        incidents: base,
        trafficDensity: base * 8 + 20,
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

  const lineColors = ["#7342E2", "#0084FF", "#F5A623", "#3DD68C"];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6E8EC] dashboard-theme selection:bg-[#7342E2] selection:text-white">
      {/* ══ Cylinder Glassmorphism Navbar ══════════════════════════════ */}
      <div className="pt-3 pb-2">
        <Navbar variant="glass-dark" />
      </div>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* ══ Header & Export Toolbar ═══════════════════════════════════ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#12151C] border border-[#232733]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-heading text-white">
                Nagpur CCTV Analytics &amp; Intelligence Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-data bg-[#7342E2]/15 text-[#7342E2] border border-[#7342E2]/30">
                PROD TELEMETRY
              </span>
            </div>
            <p className="text-xs text-[#8B93A3] mt-0.5">
              Deep machine learning analytics on traffic congestion, incident hotspots, and operator SLA metrics
            </p>
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#181C25] border border-[#232733]">
              {(["today", "7d", "30d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase transition-all ${
                    timeRange === r
                      ? "bg-[#7342E2] text-white shadow-sm"
                      : "text-[#8B93A3] hover:text-white"
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
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#181C25] border border-[#232733] text-white outline-none cursor-pointer"
            >
              <option value="all">All Nagpur Junctions</option>
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.name}
                </option>
              ))}
            </select>

            {/* Export Buttons */}
            <button
              onClick={() => alert("Generating Nagpur CCTV Analytics PDF Intelligence Dossier...")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-md transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* ══ 4 KPI Cards Grid ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-[#8B93A3] uppercase tracking-wider block">
                  Total Analyzed Events
                </span>
                <span className="text-2xl font-bold font-mono-data text-white mt-1 block">
                  {totalAlerts}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#7342E2]/15 text-[#7342E2] flex items-center justify-center">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#232733] text-[11px] text-[#8B93A3]">
              <span className="text-emerald-400 font-semibold">+14.2%</span> vs previous 7-day period
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-[#8B93A3] uppercase tracking-wider block">
                  Average Alert Latency
                </span>
                <span className="text-2xl font-bold font-mono-data text-[#0084FF] mt-1 block">
                  {(avgLatency / 1000).toFixed(2)}s
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[#0084FF] flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#232733] text-[11px] text-[#8B93A3]">
              <span className="text-emerald-400 font-semibold">99.8%</span> delivered under 15s SLA
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-[#8B93A3] uppercase tracking-wider block">
                  Resolution Rate
                </span>
                <span className="text-2xl font-bold font-mono-data text-[#3DD68C] mt-1 block">
                  {resolvedPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#3DD68C] flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#232733] text-[11px] text-[#8B93A3]">
              <span className="text-emerald-400 font-semibold">48/50</span> verified incidents resolved
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-[#8B93A3] uppercase tracking-wider block">
                  Peak Incident Window
                </span>
                <span className="text-2xl font-bold font-mono-data text-[#F5A623] mt-1 block">
                  17:00 – 19:30
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-[#F5A623] flex items-center justify-center">
                <Zap size={20} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#232733] text-[11px] text-[#8B93A3]">
              Sitabuldi Square &amp; Wardha Rd Junction
            </div>
          </div>
        </div>

        {/* ══ Visual Charts Grid ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Hourly Breakdown */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Hourly Incident Distribution (24h)
                </h3>
                <p className="text-xs text-[#8B93A3]">
                  Detected violations categorized by time of day
                </p>
              </div>
              <span className="text-xs font-mono-data text-[#7342E2]">Active Filter</span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid stroke="#232733" strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fill: "#5A6172", fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fill: "#5A6172", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#181C25",
                      border: "1px solid #232733",
                      borderRadius: 12,
                      color: "#E6E8EC",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="incidents" fill="#7342E2" radius={[6, 6, 0, 0]} name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: 7-Day Multi-Junction Trend */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  7-Day Trend Across All Junctions
                </h3>
                <p className="text-xs text-[#8B93A3]">
                  Comparative timeline of camera node activity
                </p>
              </div>
              <span className="text-xs font-mono-data text-emerald-400">Live Sync</span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke="#232733" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#5A6172", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#5A6172", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#181C25",
                      border: "1px solid #232733",
                      borderRadius: 12,
                      color: "#E6E8EC",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#8B93A3" }} />
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
        <div className="p-5 rounded-2xl bg-[#12151C] border border-[#232733] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Nagpur Junction Safety &amp; Enforcement Index
              </h3>
              <p className="text-xs text-[#8B93A3]">
                Aggregated compliance ratings and incident frequency across monitoring nodes
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#232733] text-[#8B93A3]">
                  <th className="text-left py-3 px-4 font-semibold">Junction / Node</th>
                  <th className="text-left py-3 px-4 font-semibold">Coordinates</th>
                  <th className="text-left py-3 px-4 font-semibold">Total Incidents (7d)</th>
                  <th className="text-left py-3 px-4 font-semibold">Avg Latency</th>
                  <th className="text-left py-3 px-4 font-semibold">Safety Score</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232733]">
                {cameras.map((cam, idx) => {
                  const safetyScore = 88 + idx * 3;
                  return (
                    <tr key={cam.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{cam.name}</span>
                        <span className="text-[10px] font-mono-data text-[#8B93A3]">{cam.id}</span>
                      </td>
                      <td className="py-3 px-4 font-mono-data text-[#8B93A3]">
                        {cam.location.lat.toFixed(4)}, {cam.location.lng.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 font-mono-data font-semibold text-white">
                        {64 + idx * 12}
                      </td>
                      <td className="py-3 px-4 font-mono-data text-[#3DD68C]">
                        {(3.8 + idx * 0.4).toFixed(1)}s
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-[#181C25] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#7342E2]"
                              style={{ width: `${safetyScore}%` }}
                            />
                          </div>
                          <span className="font-mono-data font-bold text-white">{safetyScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
