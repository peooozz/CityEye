"use client";

import { useDashboardStore } from "@/lib/store";
import { cameras, getEventLabel } from "@/lib/mock-data";
import { useMemo, useState } from "react";
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
  AlertTriangle,
  Clock,
  TrendingDown,
  Activity,
  Download,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════════════════════════════════════ */
function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  mono,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  mono?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4 scanline-texture"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p
        className={`text-2xl font-semibold ${mono ? "font-mono-data" : ""}`}
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Analytics Page
   ═══════════════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const dailyStats = useDashboardStore((s) => s.dailyStats);
  const alerts = useDashboardStore((s) => s.alerts);
  const [selectedCamera, setSelectedCamera] = useState("all");

  // Today's stats
  const todayStr = new Date().toISOString().split("T")[0];
  const todayStats = dailyStats.filter((s) => s.date === todayStr);

  const totalAlertsToday = useMemo(() => {
    if (selectedCamera === "all")
      return todayStats.reduce((sum, s) => sum + s.totalAlerts, 0);
    return (
      todayStats.find((s) => s.cameraId === selectedCamera)?.totalAlerts || 0
    );
  }, [todayStats, selectedCamera]);

  const avgLatency = useMemo(() => {
    const relevant =
      selectedCamera === "all"
        ? todayStats
        : todayStats.filter((s) => s.cameraId === selectedCamera);
    if (!relevant.length) return 0;
    return (
      relevant.reduce((sum, s) => sum + s.avgLatencyMs, 0) / relevant.length
    );
  }, [todayStats, selectedCamera]);

  const falsePositiveRate = useMemo(() => {
    const relevant =
      selectedCamera === "all"
        ? todayStats
        : todayStats.filter((s) => s.cameraId === selectedCamera);
    if (!relevant.length) return 0;
    return (
      relevant.reduce((sum, s) => sum + s.falsePositiveRate, 0) /
      relevant.length
    );
  }, [todayStats, selectedCamera]);

  // Peak hour
  const peakHour = useMemo(() => {
    const hourTotals = Array(24).fill(0);
    const relevant =
      selectedCamera === "all"
        ? todayStats
        : todayStats.filter((s) => s.cameraId === selectedCamera);
    relevant.forEach((s) =>
      s.hourlyBreakdown.forEach((h) => (hourTotals[h.hour] += h.count))
    );
    const maxIdx = hourTotals.indexOf(Math.max(...hourTotals));
    return `${maxIdx.toString().padStart(2, "0")}:00`;
  }, [todayStats, selectedCamera]);

  // Hourly chart data
  const hourlyData = useMemo(() => {
    const data = [];
    const relevant =
      selectedCamera === "all"
        ? todayStats
        : todayStats.filter((s) => s.cameraId === selectedCamera);
    for (let h = 0; h < 24; h++) {
      let count = 0;
      relevant.forEach((s) => {
        const hEntry = s.hourlyBreakdown.find((b) => b.hour === h);
        if (hEntry) count += hEntry.count;
      });
      data.push({ hour: `${h.toString().padStart(2, "0")}:00`, alerts: count });
    }
    return data;
  }, [todayStats, selectedCamera]);

  // 7-day trend data
  const trendData = useMemo(() => {
    const dates = [...new Set(dailyStats.map((s) => s.date))].sort();
    return dates.map((date) => {
      const entry: Record<string, string | number> = { date: date.slice(5) };
      cameras.forEach((cam) => {
        const stat = dailyStats.find(
          (s) => s.date === date && s.cameraId === cam.id
        );
        entry[cam.name] = stat?.totalAlerts || 0;
      });
      return entry;
    });
  }, [dailyStats]);

  // Camera table data
  const tableData = useMemo(() => {
    return cameras.map((cam) => {
      const camStats = dailyStats.filter((s) => s.cameraId === cam.id);
      const totalAlerts = camStats.reduce((s, d) => s + d.totalAlerts, 0);
      const avgLat =
        camStats.length > 0
          ? camStats.reduce((s, d) => s + d.avgLatencyMs, 0) / camStats.length
          : 0;
      const resolvedRate =
        camStats.length > 0
          ? camStats.reduce((s, d) => s + d.resolvedRate, 0) / camStats.length
          : 0;
      const fpRate =
        camStats.length > 0
          ? camStats.reduce((s, d) => s + d.falsePositiveRate, 0) /
            camStats.length
          : 0;
      return {
        camera: cam.name,
        id: cam.id,
        totalAlerts,
        avgLatency: avgLat,
        resolvedRate,
        fpRate,
      };
    });
  }, [dailyStats]);

  const lineColors = ["#0084FF", "#F5A623", "#3DD68C", "#A855F7"];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Top Bar: Date picker + Camera selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Analytics
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Performance metrics and alert trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="rounded-lg px-3 py-2 text-xs outline-none cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <option value="all">All Cameras</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
            style={{
              background: "rgba(0,132,255,0.15)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(0,132,255,0.2)",
            }}
          >
            <Download size={12} />
            Export Report (PDF)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Alerts Today"
          value={totalAlertsToday.toString()}
          icon={AlertTriangle}
          color="var(--accent-red)"
        />
        <KpiCard
          label="Avg Alert Latency"
          value={`${(avgLatency / 1000).toFixed(1)}s`}
          icon={Clock}
          color="var(--accent-primary)"
          mono
        />
        <KpiCard
          label="False Positive Rate"
          value={`${(falsePositiveRate * 100).toFixed(1)}%`}
          icon={TrendingDown}
          color="var(--accent-amber)"
        />
        <KpiCard
          label="Peak Alert Hour"
          value={peakHour}
          icon={Activity}
          color="var(--accent-green)"
          mono
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly bar chart */}
        <div
          className="rounded-xl border p-4 scanline-texture"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h3
            className="text-sm font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Alerts Per Hour (Today)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData}>
              <CartesianGrid stroke="#232733" strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#5A6172", fontSize: 10 }}
                interval={3}
              />
              <YAxis tick={{ fill: "#5A6172", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#181C25",
                  border: "1px solid #232733",
                  borderRadius: 8,
                  color: "#E6E8EC",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="alerts"
                fill="#0084FF"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-day line chart */}
        <div
          className="rounded-xl border p-4 scanline-texture"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h3
            className="text-sm font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            7-Day Alert Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#232733" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#5A6172", fontSize: 10 }}
              />
              <YAxis tick={{ fill: "#5A6172", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#181C25",
                  border: "1px solid #232733",
                  borderRadius: 8,
                  color: "#E6E8EC",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, color: "#8B93A3" }}
              />
              {cameras.map((cam, i) => (
                <Line
                  key={cam.id}
                  type="monotone"
                  dataKey={cam.name}
                  stroke={lineColors[i]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div
        className="rounded-xl border overflow-hidden scanline-texture"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                {[
                  "Camera",
                  "Total Alerts (7d)",
                  "Avg Latency",
                  "Resolved %",
                  "False Positive %",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 transition-colors"
                  style={{ borderColor: "var(--border-subtle)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--bg-surface-raised)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <div>
                      <span style={{ color: "var(--text-primary)" }}>
                        {row.camera}
                      </span>
                      <span
                        className="font-mono-data ml-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {row.id}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-mono-data"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {row.totalAlerts}
                  </td>
                  <td className="px-4 py-3 font-mono-data">
                    <span
                      style={{
                        color:
                          row.avgLatency < 15000
                            ? "var(--accent-green)"
                            : row.avgLatency < 30000
                            ? "var(--accent-amber)"
                            : "var(--accent-red)",
                      }}
                    >
                      {(row.avgLatency / 1000).toFixed(1)}s
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-mono-data"
                    style={{ color: "var(--accent-green)" }}
                  >
                    {(row.resolvedRate * 100).toFixed(1)}%
                  </td>
                  <td
                    className="px-4 py-3 font-mono-data"
                    style={{ color: "var(--accent-amber)" }}
                  >
                    {(row.fpRate * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
