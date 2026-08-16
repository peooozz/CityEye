"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  Navigation,
  ArrowRight,
  Zap,
  LockKeyhole,
  Fingerprint,
  Activity,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#192837] overflow-x-hidden selection:bg-[#7342E2] selection:text-white font-body">
      {/* ══ Video & Ambient Liquid Glows ═══════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        >
          <source src="/videos/cctv_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7342E2]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#0084FF]/10 blur-[140px]" />
      </div>

      {/* ══ Cylinder Floating Glass Navbar ═════════════════════════════ */}
      <div className="relative z-20 pt-3 pb-2">
        <Navbar variant="glass-light" />
      </div>

      {/* ══ Hero Section ═══════════════════════════════════════════════ */}
      <main className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col items-center text-center">
        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[0_4px_16px_rgba(115,66,226,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] text-xs font-semibold text-[#192837] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#7342E2] animate-pulse" />
          <span className="font-mono-data text-[#7342E2] font-bold">HACKATHON PROTOTYPE</span>
          <span className="text-black/30">|</span>
          <span className="text-[#5A6B7C]">Nagpur Municipal AI CCTV Network</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading tracking-tight leading-[1.08] max-w-4xl text-[#192837]"
        >
          AI-Assisted CCTV{" "}
          <span className="inline-flex items-center mx-1 align-middle">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-md flex items-center justify-center text-red-600">
              <ShieldAlert size={22} />
            </span>
          </span>{" "}
          Video Monitoring &amp;{" "}
          <span className="inline-flex items-center mx-1 align-middle">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-md flex items-center justify-center text-amber-600">
              <Navigation size={22} className="rotate-180" />
            </span>
          </span>{" "}
          Violation Detection
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#5A6B7C] max-w-2xl font-normal leading-relaxed"
        >
          High-precision real-time computer vision for municipal CCTV networks. Automatically tracks <strong>Without-Helmet Riders</strong>, detects <strong>Wrong-Side Vehicles</strong> with directional optical flow, and triggers instant e-Challans under 2 seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link href="/feeds">
            <motion.button
              whileHover={{ scale: 1.04, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#7342E2] shadow-[0_8px_24px_rgba(115,66,226,0.35)] hover:shadow-[0_12px_32px_rgba(115,66,226,0.45)] transition-all cursor-pointer"
            >
              <span>Launch Live AI Feeds</span>
              <ArrowRight size={16} />
            </motion.button>
          </Link>

          <Link href="/incidents">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-white/50 hover:bg-white/80 text-[#192837] border border-white/80 shadow-[0_8px_24px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all cursor-pointer"
            >
              <ShieldAlert size={16} className="text-red-600" />
              <span>No-Helmet &amp; Wrong-Side Triage</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 p-4 sm:p-5 rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl w-full"
        >
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#192837]">No-Helmet AI</h4>
              <p className="text-[11px] text-[#5A6B7C] mt-0.5">YOLOv8 head-region detection on two-wheelers</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700">
              <Navigation size={18} className="rotate-180" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#192837]">Wrong-Side Vector</h4>
              <p className="text-[11px] text-[#5A6B7C] mt-0.5">Optical flow trajectory &amp; reverse lane angle detection</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#192837]">Sub-40ms Latency</h4>
              <p className="text-[11px] text-[#5A6B7C] mt-0.5">TensorRT FP16 acceleration on 1080p RTSP feeds</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
