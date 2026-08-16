"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { useDashboardStore } from "@/lib/store";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { getEventLabel, cameras } from "@/lib/mock-data";
import { Alert, AlertStatus, AlertEventType } from "@/lib/types";
import {
  AlertTriangle,
  Shield,
  Eye,
  Check,
  X,
  Send,
  Zap,
  Filter,
  Search,
  Clock,
  MapPin,
  FileText,
  Radio,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IncidentsPage() {
  useSimulatedSocket();
  const alerts = useDashboardStore((s) => s.alerts);
  const updateAlertStatus = useDashboardStore((s) => s.updateAlertStatus);
  const addNote = useDashboardStore((s) => s.addNote);

  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<Alert | null>(null);
  const [noteText, setNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    if (eventTypeFilter !== "all" && alert.eventType !== eventTypeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        alert.id.toLowerCase().includes(q) ||
        alert.cameraName.toLowerCase().includes(q) ||
        alert.eventType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const newCount = alerts.filter((a) => a.status === "new").length;
  const ackCount = alerts.filter((a) => a.status === "acknowledged").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6E8EC] dashboard-theme selection:bg-[#7342E2] selection:text-white">
      {/* ══ Top Cylinder Glassmorphism Navbar ══════════════════════════ */}
      <div className="pt-3 pb-2">
        <Navbar variant="glass-dark" />
      </div>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* ══ Header & Quick Stats Row ═══════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#12151C] border border-[#232733] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8B93A3] block uppercase tracking-wider">
                Critical / New Alerts
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-[#FF4D4F]">
                  {newCount}
                </span>
                <span className="text-[11px] text-[#FF4D4F]/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4F] animate-pulse" />
                  Requires Triage
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#FF4D4F] flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12151C] border border-[#232733] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8B93A3] block uppercase tracking-wider">
                In-Progress / Ack&apos;d
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-[#F5A623]">
                  {ackCount}
                </span>
                <span className="text-[11px] text-[#8B93A3]">Patrol Dispatched</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5A623] flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12151C] border border-[#232733] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8B93A3] block uppercase tracking-wider">
                Resolved Today
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-[#3DD68C]">
                  {resolvedCount}
                </span>
                <span className="text-[11px] text-emerald-400/80">98.4% Resolution</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#3DD68C] flex items-center justify-center">
              <Check size={20} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12151C] border border-[#232733] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8B93A3] block uppercase tracking-wider">
                Mean Dispatch Time
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-[#0084FF]">
                  1.4 min
                </span>
                <span className="text-[11px] text-blue-400/80">-18s vs SLA</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0084FF] flex items-center justify-center">
              <Zap size={20} />
            </div>
          </div>
        </div>

        {/* ══ Filter & Search Bar ════════════════════════════════════════ */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#232733] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A3]" />
            <input
              type="text"
              placeholder="Search by Alert ID, Junction name, or event type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181C25] border border-[#232733] text-xs text-white placeholder-[#5A6172] focus:outline-none focus:border-[#7342E2]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#181C25] border border-[#232733]">
              {(["all", "new", "acknowledged", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                    statusFilter === st
                      ? "bg-[#7342E2] text-white shadow-sm"
                      : "text-[#8B93A3] hover:text-white"
                  }`}
                >
                  {st === "all" ? "All Status" : st}
                </button>
              ))}
            </div>

            {/* Event Type Filter */}
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#181C25] border border-[#232733] text-white outline-none cursor-pointer"
            >
              <option value="all">All Incident Types</option>
              <option value="illegal_parking">Illegal Parking</option>
              <option value="wrong_way">Wrong-Way Movement</option>
              <option value="loitering">Loitering Detected</option>
              <option value="crowd_density">Crowd Density Surge</option>
            </select>
          </div>
        </div>

        {/* ══ Incidents Stream Grid ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAlerts.slice(0, 24).map((alert) => {
              const isNew = alert.status === "new";
              const isAck = alert.status === "acknowledged";
              const isRes = alert.status === "resolved";

              const borderColor = isNew
                ? "#FF4D4F"
                : isAck
                ? "#F5A623"
                : isRes
                ? "#3DD68C"
                : "#5A6172";

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl bg-[#12151C] border border-[#232733] overflow-hidden hover:border-[#7342E2]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  style={{ borderLeft: `4px solid ${borderColor}` }}
                >
                  {/* Top Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono-data text-[#8B93A3] block">
                          {alert.id} · Track: {alert.trackId}
                        </span>
                        <h3 className="font-bold text-sm text-white mt-0.5">
                          {getEventLabel(alert.eventType)}
                        </h3>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${borderColor}15`,
                          color: borderColor,
                        }}
                      >
                        {alert.status}
                      </span>
                    </div>

                    {/* Snapshot & Camera Info */}
                    <div className="flex gap-3">
                      <div className="w-24 h-16 rounded-lg bg-[#181C25] overflow-hidden flex-shrink-0 border border-[#232733]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={alert.snapshotUrl}
                          alt="Incident frame"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <MapPin size={12} className="text-[#7342E2] flex-shrink-0" />
                          <span className="truncate">{alert.cameraName}</span>
                        </div>
                        <div className="text-[11px] text-[#8B93A3] font-mono-data">
                          Detected: {new Date(alert.detectedAt).toLocaleTimeString("en-IN")}
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-[#7342E2]/15 text-[#7342E2]">
                            Conf: {Math.round(alert.confidence * 100)}%
                          </span>
                          <span className="text-[10px] font-mono-data px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                            Latency: {(alert.latencyMs / 1000).toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-3 bg-[#181C25]/80 border-t border-[#232733] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedIncident(alert)}
                      className="text-xs font-semibold text-[#7342E2] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Audit Log</span>
                      <ChevronRight size={13} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {alert.status === "new" && (
                        <>
                          <button
                            onClick={() => updateAlertStatus(alert.id, "acknowledged", "Officer On-Duty")}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-[#F5A623] border border-amber-500/30 transition-colors cursor-pointer"
                          >
                            Ack &amp; Dispatch
                          </button>
                          <button
                            onClick={() => updateAlertStatus(alert.id, "false_positive")}
                            className="p-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-[#8B93A3] hover:text-white transition-colors cursor-pointer"
                            title="False Positive"
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <button
                          onClick={() => updateAlertStatus(alert.id, "resolved", "Officer On-Duty")}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-[#3DD68C] border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check size={12} />
                          Resolve
                        </button>
                      )}
                      {alert.status === "resolved" && (
                        <span className="text-[11px] text-emerald-400 font-mono-data">
                          ✓ Closed Case
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ Incident Detail & Audit Drawer ═════════════════════════════ */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-lg h-full bg-[#12151C] border-l border-[#232733] p-6 overflow-y-auto space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
                <div>
                  <span className="text-xs font-mono-data text-[#8B93A3] block">
                    INCIDENT CASE // {selectedIncident.id}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {getEventLabel(selectedIncident.eventType)}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Snapshot Display */}
              <div className="rounded-xl overflow-hidden border border-[#232733] bg-[#07090E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedIncident.snapshotUrl}
                  alt="Snapshot frame"
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Metadata Table */}
              <div className="rounded-xl bg-[#181C25] border border-[#232733] divide-y divide-[#232733] text-xs">
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#8B93A3]">Camera Junction</span>
                  <span className="font-semibold text-white">{selectedIncident.cameraName}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#8B93A3]">AI Confidence Score</span>
                  <span className="font-mono-data font-bold text-[#7342E2]">
                    {Math.round(selectedIncident.confidence * 100)}% Match
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#8B93A3]">Detection Timestamp</span>
                  <span className="font-mono-data text-white">
                    {new Date(selectedIncident.detectedAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#8B93A3]">Pipeline Latency</span>
                  <span className="font-mono-data text-[#3DD68C]">
                    {(selectedIncident.latencyMs / 1000).toFixed(2)}s (Sub-SLA)
                  </span>
                </div>
              </div>

              {/* Operator Notes Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#8B93A3] block">
                  Operator Incident Log &amp; Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter dispatch notes, officer badge ID, or municipal report details..."
                  value={noteText || selectedIncident.notes || ""}
                  onChange={(e) => setNoteText(e.target.value)}
                  onBlur={() => {
                    if (noteText) addNote(selectedIncident.id, noteText);
                  }}
                  className="w-full p-3 rounded-xl bg-[#181C25] border border-[#232733] text-xs text-white placeholder-[#5A6172] focus:outline-none focus:border-[#7342E2] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {selectedIncident.status === "new" && (
                  <button
                    onClick={() => {
                      updateAlertStatus(selectedIncident.id, "acknowledged", "Duty Officer");
                      setSelectedIncident(null);
                    }}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#F5A623] hover:bg-[#e09315] text-[#0B0E14] shadow-md transition-all cursor-pointer"
                  >
                    Acknowledge &amp; Dispatch Patrol
                  </button>
                )}
                {selectedIncident.status === "acknowledged" && (
                  <button
                    onClick={() => {
                      updateAlertStatus(selectedIncident.id, "resolved", "Duty Officer");
                      setSelectedIncident(null);
                    }}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#3DD68C] hover:bg-[#32be7a] text-[#0B0E14] shadow-md transition-all cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
