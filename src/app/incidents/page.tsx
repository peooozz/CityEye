"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { useDashboardStore } from "@/lib/store";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { getEventLabel } from "@/lib/mock-data";
import { Alert, AlertStatus, AlertEventType } from "@/lib/types";
import {
  ShieldAlert,
  Navigation,
  AlertTriangle,
  Check,
  X,
  Search,
  Clock,
  MapPin,
  Zap,
  ChevronRight,
  FileCheck2,
  Share2,
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
        alert.eventType.toLowerCase().includes(q) ||
        (alert.licensePlate && alert.licensePlate.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const noHelmetCount = alerts.filter((a) => a.eventType === "no_helmet").length;
  const wrongSideCount = alerts.filter((a) => a.eventType === "wrong_side" || a.eventType === "wrong_way").length;
  const newCount = alerts.filter((a) => a.status === "new").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

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
          <source src="/videos/cctv_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/40 to-white/75" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#7342E2]/10 blur-[130px]" />
        <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-[#FF4D4F]/8 blur-[140px]" />
      </div>

      {/* ══ Top Cylinder Glassmorphism Navbar ══════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* ══ Header & ML Metric Cards Row ══════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* No Helmet Card */}
          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A6B7C] block uppercase tracking-wider">
                No-Helmet Detections
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-red-600">
                  {noHelmetCount}
                </span>
                <span className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  YOLOv8 Head Model
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-red-500/15 text-red-600 border border-red-500/25 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
          </div>

          {/* Wrong Side Card */}
          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A6B7C] block uppercase tracking-wider">
                Wrong-Side Vehicles
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-amber-700">
                  {wrongSideCount}
                </span>
                <span className="text-[11px] text-amber-700 font-bold">180° Angle Contravention</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-500/25 flex items-center justify-center">
              <Navigation size={20} className="rotate-180" />
            </div>
          </div>

          {/* Triage Pending */}
          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A6B7C] block uppercase tracking-wider">
                Pending Triage
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-[#192837]">
                  {newCount} Cases
                </span>
                <span className="text-[11px] text-[#5A6B7C]">Requires Action</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-black/[0.05] text-[#192837] border border-black/[0.08] flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          {/* Challans Issued */}
          <div className="p-5 rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A6B7C] block uppercase tracking-wider">
                E-Challans Dispatched
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono-data text-emerald-700">
                  {resolvedCount}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">Automatic ANPR Sync</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 flex items-center justify-center">
              <FileCheck2 size={20} />
            </div>
          </div>
        </div>

        {/* ══ Filter & Search Bar ════════════════════════════════════════ */}
        <div className="p-4 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B7C]" />
            <input
              type="text"
              placeholder="Search by Plate (e.g. MH-31), Junction, or Alert ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/60 border border-white/80 text-xs text-[#192837] placeholder-[#8B93A3] focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all shadow-sm font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Violation Category Filter */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/50 backdrop-blur-xl border border-white/70 shadow-sm">
              <button
                onClick={() => setEventTypeFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  eventTypeFilter === "all"
                    ? "bg-[#7342E2] text-white shadow-md"
                    : "text-[#192837]/80 hover:text-[#192837] hover:bg-white/60"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setEventTypeFilter("no_helmet")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  eventTypeFilter === "no_helmet"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-red-700 hover:bg-red-500/10"
                }`}
              >
                <ShieldAlert size={12} />
                <span>No Helmet</span>
              </button>
              <button
                onClick={() => setEventTypeFilter("wrong_side")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  eventTypeFilter === "wrong_side"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-amber-800 hover:bg-amber-500/10"
                }`}
              >
                <Navigation size={12} className="rotate-180" />
                <span>Wrong Side</span>
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/50 backdrop-blur-xl border border-white/70 shadow-sm">
              {(["all", "new", "acknowledged", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#192837] text-white shadow-md"
                      : "text-[#192837]/80 hover:text-[#192837] hover:bg-white/60"
                  }`}
                >
                  {st === "all" ? "All Status" : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Incidents Stream Grid ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredAlerts.slice(0, 24).map((alert) => {
              const isNoHelmet = alert.eventType === "no_helmet";
              const isWrongSide = alert.eventType === "wrong_side" || alert.eventType === "wrong_way";

              const borderColor = isNoHelmet
                ? "#FF3B30"
                : isWrongSide
                ? "#FF9500"
                : alert.status === "new"
                ? "#E53E3E"
                : alert.status === "acknowledged"
                ? "#D97706"
                : "#10B981";

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-3xl bg-white/45 backdrop-blur-3xl border border-white/80 overflow-hidden hover:border-[#7342E2]/60 hover:shadow-[0_12px_36px_rgba(115,66,226,0.12)] transition-all duration-200 flex flex-col justify-between shadow-[0_8px_32px_rgba(25,40,55,0.05)]"
                  style={{ borderLeft: `5px solid ${borderColor}` }}
                >
                  {/* Top Details */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-data text-[#5A6B7C] block">
                            {alert.id} · {alert.trackId}
                          </span>
                          {alert.licensePlate && (
                            <span className="px-2 py-0.2 rounded bg-black/80 text-white font-mono-data text-[9.5px] font-bold">
                              {alert.licensePlate}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[#192837] mt-0.5 flex items-center gap-1.5">
                          {isNoHelmet && <ShieldAlert size={14} className="text-red-600" />}
                          {isWrongSide && <Navigation size={14} className="text-amber-700 rotate-180" />}
                          <span>{getEventLabel(alert.eventType)}</span>
                        </h3>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${borderColor}15`,
                          borderColor: `${borderColor}40`,
                          color: borderColor,
                        }}
                      >
                        {alert.status}
                      </span>
                    </div>

                    {/* Snapshot & Camera Info */}
                    <div className="flex gap-3.5">
                      <div className="w-24 h-16 rounded-2xl bg-[#0C121E] overflow-hidden flex-shrink-0 border border-white/40 shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={alert.snapshotUrl}
                          alt="Incident frame"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[#192837] font-semibold">
                          <MapPin size={12} className="text-[#7342E2] flex-shrink-0" />
                          <span className="truncate">{alert.cameraName}</span>
                        </div>
                        <div className="text-[11px] text-[#5A6B7C] font-mono-data">
                          Detected: {new Date(alert.detectedAt).toLocaleTimeString("en-IN")}
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-[#7342E2]/15 text-[#7342E2] font-bold border border-[#7342E2]/30">
                            Match: {Math.round(alert.confidence * 100)}%
                          </span>
                          {alert.speedKmph && (
                            <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 font-bold border border-amber-500/30">
                              {alert.speedKmph} km/h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3 bg-white/40 border-t border-white/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedIncident(alert)}
                      className="text-xs font-bold text-[#7342E2] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>ANPR &amp; Audit Dossier</span>
                      <ChevronRight size={13} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {alert.status === "new" && (
                        <>
                          <button
                            onClick={() => updateAlertStatus(alert.id, "acknowledged", "Officer On-Duty")}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <FileCheck2 size={12} />
                            Issue Challan
                          </button>
                          <button
                            onClick={() => updateAlertStatus(alert.id, "false_positive")}
                            className="p-2 rounded-full bg-white/60 hover:bg-white text-[#5A6B7C] hover:text-[#192837] border border-white/80 shadow-sm transition-colors cursor-pointer"
                            title="False Positive"
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <button
                          onClick={() => updateAlertStatus(alert.id, "resolved", "Officer On-Duty")}
                          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 border border-emerald-500/40 shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check size={12} />
                          Fine Paid / Close
                        </button>
                      )}
                      {alert.status === "resolved" && (
                        <span className="text-[11px] text-emerald-700 font-mono-data font-bold">
                          ✓ Challan Settled
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
            className="fixed inset-0 z-50 flex justify-end bg-[#192837]/40 backdrop-blur-md"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="w-full max-w-lg h-full bg-white/95 backdrop-blur-3xl border-l border-white p-6 overflow-y-auto space-y-6 shadow-2xl text-[#192837]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                <div>
                  <span className="text-xs font-mono-data text-[#5A6B7C] block">
                    TRAFFIC ENFORCEMENT CASE // {selectedIncident.id}
                  </span>
                  <h2 className="text-lg font-bold font-heading text-[#192837] mt-0.5">
                    {getEventLabel(selectedIncident.eventType)}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#192837] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Snapshot Display */}
              <div className="rounded-2xl overflow-hidden border border-white bg-[#0C121E] shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedIncident.snapshotUrl}
                  alt="Snapshot frame"
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Metadata Table with ANPR & Fine Details */}
              <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white divide-y divide-black/[0.06] text-xs shadow-sm">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">License Plate (ANPR)</span>
                  <span className="font-mono-data font-bold text-[#192837] bg-black/5 px-2 py-0.5 rounded">
                    {selectedIncident.licensePlate || "MH-31-BK-4091"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">Vehicle Classification</span>
                  <span className="font-bold text-[#192837]">{selectedIncident.vehicleType || "Motorcycle"}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">Camera Junction</span>
                  <span className="font-bold text-[#192837]">{selectedIncident.cameraName}</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">AI Model Confidence</span>
                  <span className="font-mono-data font-bold text-[#7342E2]">
                    {Math.round(selectedIncident.confidence * 100)}% Match
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">Applicable Fine (Nagpur RTO)</span>
                  <span className="font-mono-data font-bold text-red-600">
                    {selectedIncident.eventType === "no_helmet" ? "₹1,000 (Section 194D)" : "₹5,000 (Section 184 Dangerous Driving)"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[#5A6B7C]">Detection Timestamp</span>
                  <span className="font-mono-data text-[#192837] font-semibold">
                    {new Date(selectedIncident.detectedAt).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Operator Notes Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5A6B7C] block">
                  Enforcement Officer Action Log
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter officer notes, RTO notice dispatch ID, or towing remarks..."
                  value={noteText || selectedIncident.notes || ""}
                  onChange={(e) => setNoteText(e.target.value)}
                  onBlur={() => {
                    if (noteText) addNote(selectedIncident.id, noteText);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-white/70 border border-white text-xs text-[#192837] placeholder-[#8B93A3] focus:outline-none focus:border-[#7342E2] focus:bg-white resize-none shadow-sm font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                {selectedIncident.status === "new" && (
                  <button
                    onClick={() => {
                      updateAlertStatus(selectedIncident.id, "acknowledged", "Duty Officer");
                      alert(`Digital E-Challan dispatched via SMS to vehicle owner for ${selectedIncident.licensePlate || "MH-31-BK-4091"}`);
                      setSelectedIncident(null);
                    }}
                    className="flex-1 py-3.5 rounded-full text-xs font-bold bg-[#7342E2] hover:bg-[#6434d3] text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 size={14} />
                    <span>Issue E-Challan via SMS</span>
                  </button>
                )}
                {selectedIncident.status === "acknowledged" && (
                  <button
                    onClick={() => {
                      updateAlertStatus(selectedIncident.id, "resolved", "Duty Officer");
                      setSelectedIncident(null);
                    }}
                    className="flex-1 py-3.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
                  >
                    Mark Resolved &amp; Fine Settled
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
