"use client";

import { cameras, getEventLabel } from "@/lib/mock-data";
import { useDashboardStore } from "@/lib/store";
import { Camera, Alert, AlertStatus } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Check,
  X,
  AlertTriangle,
  Eye,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   Camera Tile
   ═══════════════════════════════════════════════════════════════════════ */
function CameraTile({ camera }: { camera: Camera }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.01] group scanline-texture"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-primary)";
        e.currentTarget.style.boxShadow =
          "0 0 20px rgba(0,132,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {camera.name}
          </span>
          <span
            className="text-[10px] font-mono-data"
            style={{ color: "var(--text-muted)" }}
          >
            {camera.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-mono-data text-[#3DD68C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3DD68C] animate-live-pulse" />
            LIVE
          </span>
          <span
            className="text-[10px] font-mono-data px-2 py-0.5 rounded"
            style={{
              background: "var(--bg-surface-raised)",
              color: "var(--text-muted)",
            }}
          >
            {camera.fps} FPS
          </span>
        </div>
      </div>

      {/* Video placeholder with overlays */}
      <div className="relative aspect-video bg-[#0a0c10]">
        {/* Placeholder CCTV frame */}
        <svg
          viewBox="0 0 640 360"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id={`grid-${camera.id}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="640" height="360" fill={`url(#grid-${camera.id})`} />

          {/* No Parking Zone polygon */}
          <polygon
            points="80,120 220,100 240,260 60,280"
            fill="none"
            stroke="#0084FF"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.6"
          />
          <text x="110" y="200" fill="#0084FF" fontSize="11" fontFamily="monospace" opacity="0.7">
            No Parking Zone
          </text>

          {/* Detected vehicle bounding box */}
          <rect
            x="320"
            y="140"
            width="120"
            height="80"
            fill="none"
            stroke="#FF4D4F"
            strokeWidth="2"
            rx="2"
          />
          <rect x="320" y="125" width="170" height="16" fill="rgba(255,77,79,0.85)" rx="2" />
          <text x="326" y="137" fill="white" fontSize="10" fontFamily="monospace">
            Vehicle #142 · Stopped 34s
          </text>

          {/* Camera info */}
          <text x="16" y="24" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="monospace">
            {camera.name}
          </text>
          <text x="16" y="348" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace">
            {time}
          </text>
        </svg>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="text-[10px] font-mono-data"
          style={{ color: "var(--text-muted)" }}
        >
          Inference: 42ms
        </span>
        <span
          className="text-[10px] font-mono-data"
          style={{ color: "var(--text-muted)" }}
        >
          1080p · H.264
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Alert Card
   ═══════════════════════════════════════════════════════════════════════ */
function getLatencyColor(ms: number): string {
  if (ms < 15000) return "var(--accent-green)";
  if (ms < 30000) return "var(--accent-amber)";
  return "var(--accent-red)";
}

function getStatusColor(status: AlertStatus): string {
  switch (status) {
    case "new":
      return "var(--accent-red)";
    case "acknowledged":
      return "var(--accent-amber)";
    case "resolved":
      return "var(--accent-green)";
    case "false_positive":
      return "var(--text-muted)";
  }
}

function getStatusLabel(status: AlertStatus): string {
  switch (status) {
    case "new": return "New";
    case "acknowledged": return "Ack'd";
    case "resolved": return "Resolved";
    case "false_positive": return "False +";
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function AlertCard({ alert, isNew }: { alert: Alert; isNew?: boolean }) {
  const updateAlertStatus = useDashboardStore((s) => s.updateAlertStatus);
  const setSelectedAlertId = useDashboardStore((s) => s.setSelectedAlertId);
  const statusColor = getStatusColor(alert.status);
  const latencyColor = getLatencyColor(alert.latencyMs);

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -20, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-lg border overflow-hidden cursor-pointer transition-colors ${
        isNew ? "animate-glow-ring" : ""
      }`}
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        borderLeft: `4px solid ${statusColor}`,
      }}
      onClick={() => setSelectedAlertId(alert.id)}
    >
      <div className="p-3 flex gap-3">
        {/* Snapshot thumbnail */}
        <div
          className="w-16 h-16 rounded flex-shrink-0 overflow-hidden"
          style={{ background: "var(--bg-base)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={alert.snapshotUrl}
            alt="Alert snapshot"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {getEventLabel(alert.eventType)}
              </p>
              <p
                className="text-[11px] truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {alert.cameraName}
              </p>
            </div>
            <span
              className="text-[10px] font-mono-data flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
              title={new Date(alert.detectedAt).toLocaleString()}
            >
              {timeAgo(alert.detectedAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Confidence */}
            <span
              className="text-[10px] font-mono-data px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(0,132,255,0.1)",
                color: "var(--accent-primary)",
              }}
            >
              {Math.round(alert.confidence * 100)}%
            </span>

            {/* Latency */}
            <span
              className="text-[10px] font-mono-data flex items-center gap-1 px-1.5 py-0.5 rounded"
              style={{
                background: `${latencyColor}15`,
                color: latencyColor,
              }}
            >
              <Zap size={9} />
              {(alert.latencyMs / 1000).toFixed(1)}s
            </span>

            {/* Status */}
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                background: `${statusColor}15`,
                color: statusColor,
              }}
            >
              {getStatusLabel(alert.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {alert.status === "new" && (
        <div
          className="flex border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateAlertStatus(alert.id, "acknowledged", "Operator A");
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors cursor-pointer"
            style={{ color: "var(--accent-amber)" }}
            title="Acknowledge"
          >
            <Eye size={12} />
            Ack
          </button>
          <div className="w-px" style={{ background: "var(--border-subtle)" }} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateAlertStatus(alert.id, "resolved", "Operator A");
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors cursor-pointer"
            style={{ color: "var(--accent-green)" }}
            title="Resolve"
          >
            <Check size={12} />
            Resolve
          </button>
          <div className="w-px" style={{ background: "var(--border-subtle)" }} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateAlertStatus(alert.id, "false_positive");
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title="False Positive"
          >
            <X size={12} />
            False +
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Alert Detail Sheet
   ═══════════════════════════════════════════════════════════════════════ */
function AlertDetailSheet() {
  const alerts = useDashboardStore((s) => s.alerts);
  const selectedId = useDashboardStore((s) => s.selectedAlertId);
  const setSelectedId = useDashboardStore((s) => s.setSelectedAlertId);
  const updateStatus = useDashboardStore((s) => s.updateAlertStatus);
  const addNote = useDashboardStore((s) => s.addNote);

  const alert = alerts.find((a) => a.id === selectedId);
  const [noteText, setNoteText] = useState("");

  if (!alert) return null;

  const timeline = [
    { label: "Detected", time: alert.detectedAt, done: true },
    { label: "Delivered", time: alert.deliveredAt, done: true },
    {
      label: `Acknowledged${alert.acknowledgedBy ? ` by ${alert.acknowledgedBy}` : ""}`,
      time: alert.status !== "new" ? alert.deliveredAt : null,
      done: alert.status !== "new",
    },
    {
      label: "Resolved",
      time: alert.resolvedAt || null,
      done: alert.status === "resolved",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        onClick={() => setSelectedId(null)}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md h-full overflow-y-auto border-l"
          style={{
            background: "var(--bg-base)",
            borderColor: "var(--border-subtle)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Alert Detail
              </h2>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Large Snapshot */}
            <div
              className="rounded-lg overflow-hidden mb-6 border"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={alert.snapshotUrl}
                alt="Alert snapshot"
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Metadata Table */}
            <div
              className="rounded-lg border overflow-hidden mb-6"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-subtle)",
              }}
            >
              {[
                ["Camera", alert.cameraName],
                ["Location", `${alert.cameraId}`],
                ["Event Type", getEventLabel(alert.eventType)],
                ["Confidence", `${Math.round(alert.confidence * 100)}%`],
                ["Track ID", alert.trackId],
                [
                  "Detected At",
                  new Date(alert.detectedAt).toLocaleString("en-IN"),
                ],
                [
                  "Delivered At",
                  new Date(alert.deliveredAt).toLocaleString("en-IN"),
                ],
                [
                  "Computed Latency",
                  `${(alert.latencyMs / 1000).toFixed(1)}s`,
                ],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className="flex items-center px-4 py-2.5 border-b last:border-b-0"
                  style={{
                    borderColor: "var(--border-subtle)",
                    background:
                      label === "Computed Latency"
                        ? "rgba(0,132,255,0.05)"
                        : "transparent",
                  }}
                >
                  <span
                    className="text-xs w-32 flex-shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-xs ${
                      label === "Track ID" ||
                      label === "Computed Latency" ||
                      label === "Detected At" ||
                      label === "Delivered At"
                        ? "font-mono-data"
                        : "font-medium"
                    }`}
                    style={{
                      color:
                        label === "Computed Latency"
                          ? getLatencyColor(alert.latencyMs)
                          : "var(--text-primary)",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Timeline */}
            <div className="mb-6">
              <h3
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Timeline
              </h3>
              <div className="space-y-0">
                {timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                        style={{
                          borderColor: step.done
                            ? "var(--accent-primary)"
                            : "var(--border-subtle)",
                          background: step.done
                            ? "var(--accent-primary)"
                            : "transparent",
                        }}
                      />
                      {i < timeline.length - 1 && (
                        <div
                          className="w-px h-8"
                          style={{
                            background: step.done
                              ? "var(--accent-primary)"
                              : "var(--border-subtle)",
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className="text-xs font-medium"
                        style={{
                          color: step.done
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                        }}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <p
                          className="text-[10px] font-mono-data"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(step.time).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3
                className="text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Notes
              </h3>
              <textarea
                value={noteText || alert.notes || ""}
                onChange={(e) => setNoteText(e.target.value)}
                onBlur={() => {
                  if (noteText) addNote(alert.id, noteText);
                }}
                placeholder="Add notes about this alert..."
                rows={3}
                className="w-full rounded-lg px-3 py-2 text-xs resize-none outline-none"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Actions */}
            <div
              className="flex gap-2 pt-4 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {alert.status === "new" && (
                <button
                  onClick={() =>
                    updateStatus(alert.id, "acknowledged", "Operator A")
                  }
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                  style={{
                    background: "rgba(245,166,35,0.15)",
                    color: "var(--accent-amber)",
                  }}
                >
                  Acknowledge
                </button>
              )}
              {(alert.status === "new" ||
                alert.status === "acknowledged") && (
                <button
                  onClick={() =>
                    updateStatus(alert.id, "resolved", "Operator A")
                  }
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                  style={{
                    background: "rgba(61,214,140,0.15)",
                    color: "var(--accent-green)",
                  }}
                >
                  Resolve
                </button>
              )}
              {alert.status === "new" && (
                <button
                  onClick={() => updateStatus(alert.id, "false_positive")}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                  style={{
                    background: "var(--bg-surface)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  False Positive
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Live Alert Feed Panel
   ═══════════════════════════════════════════════════════════════════════ */
function LiveAlertFeed() {
  const alerts = useDashboardStore((s) => s.alerts);
  const filter = useDashboardStore((s) => s.alertFilter);
  const setFilter = useDashboardStore((s) => s.setAlertFilter);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter((a) => a.status === filter);
  }, [alerts, filter]);

  const filterOptions: { value: AlertStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "acknowledged", label: "Acknowledged" },
    { value: "resolved", label: "Resolved" },
  ];

  return (
    <div
      className="rounded-xl border h-full flex flex-col scanline-texture"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <Radio
            size={14}
            className="animate-live-pulse"
            style={{ color: "var(--accent-red)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Live Alerts
          </span>
          <span
            className="text-[10px] font-mono-data px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(255,77,79,0.1)",
              color: "var(--accent-red)",
            }}
          >
            {alerts.filter((a) => a.status === "new").length} new
          </span>
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] cursor-pointer"
            style={{
              background: "var(--bg-surface-raised)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {filterOptions.find((f) => f.value === filter)?.label}
            <ChevronDown size={10} />
          </button>
          {showFilter && (
            <div
              className="absolute right-0 mt-1 rounded-lg py-1 min-w-[110px] z-20"
              style={{
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilter(opt.value);
                    setShowFilter(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-[11px] cursor-pointer"
                  style={{
                    color:
                      opt.value === filter
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence initial={false}>
          {filtered.slice(0, 30).map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} isNew={i === 0} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const selectedAlertId = useDashboardStore((s) => s.selectedAlertId);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-80px)]">
        {/* LEFT: 2x2 Camera Grid */}
        <div className="lg:w-[70%] flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {cameras.map((cam) => (
              <CameraTile key={cam.id} camera={cam} />
            ))}
          </div>
        </div>

        {/* RIGHT: Live Alert Feed */}
        <div className="lg:w-[30%] min-h-[400px] lg:min-h-0">
          <LiveAlertFeed />
        </div>
      </div>

      {selectedAlertId && <AlertDetailSheet />}
    </>
  );
}
