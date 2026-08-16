"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRightCircle,
  Zap,
  LockKeyhole,
  Fingerprint,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#7342E2] selection:text-white">
      {/* ══ Full-Viewport Background Video ═════════════════════════════ */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle glass overlay gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 via-transparent to-white/40 pointer-events-none" />

      {/* ══ Floating Cylinder Glassmorphism Navbar ═════════════════════ */}
      <Navbar variant="glass-light" />

      {/* ══ Hero Content ════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 pt-[clamp(32px,6vw,60px)] pb-12 flex flex-col items-center justify-center flex-grow">
        <div className="w-full max-w-[760px] mx-auto flex flex-col items-center text-center">
          {/* Hackathon Prototype Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(25,40,55,0.06)] mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#7342E2] animate-pulse" />
            <span className="text-xs font-semibold text-[#7342E2] tracking-wide uppercase">
              AI Video Analytics Hackathon Prototype · Nagpur Smart City
            </span>
          </motion.div>

          {/* Headline (h1) */}
          <motion.h1
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading text-[clamp(1.75rem,5.5vw,3.15rem)] leading-[1.05] tracking-[-0.01em] text-[var(--color-text)] mb-6"
          >
            <span className="block whitespace-normal sm:whitespace-nowrap">
              Transform{" "}
              <Zap
                size={26}
                style={{
                  color: "#192837",
                  display: "inline",
                  verticalAlign: "middle",
                  position: "relative",
                  top: "-2px",
                  margin: "0 4px",
                }}
              />{" "}
              Every{" "}
              <LockKeyhole
                size={26}
                style={{
                  color: "#192837",
                  display: "inline",
                  verticalAlign: "middle",
                  position: "relative",
                  top: "-2px",
                  margin: "0 4px",
                }}
              />{" "}
              CCTV Camera
            </span>
            <span className="block mt-1 sm:mt-2">
              with Real-Time AI Vision{" "}
              <Fingerprint
                size={26}
                style={{
                  color: "#192837",
                  display: "inline",
                  verticalAlign: "middle",
                  position: "relative",
                  top: "-2px",
                  marginLeft: "6px",
                }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-body text-[clamp(0.95rem,2.5vw,1.125rem)] text-[var(--color-text)] opacity-85 max-w-[600px] leading-[1.65] mb-8"
          >
            Zero blindspots, millisecond response. Autonomous anomaly detection,
            live traffic &amp; crowd monitoring, and instant incident alerts across
            Nagpur&apos;s municipal CCTV network.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/feeds">
              <motion.button
                whileHover={{ scale: 1.04, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  borderRadius: "50px",
                  backgroundColor: "#7342E2",
                  boxShadow: "0 8px 30px rgba(115,66,226,0.35)",
                  minWidth: "240px",
                  padding: "17px 28px",
                }}
                className="flex items-center justify-between gap-8 text-white font-semibold text-[clamp(0.9rem,2vw,1rem)] transition-all cursor-pointer"
              >
                <span>Launch Live Feeds</span>
                <ArrowRightCircle size={20} className="text-white flex-shrink-0" />
              </motion.button>
            </Link>

            <Link href="/incidents">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-7 py-4 rounded-full bg-white/40 hover:bg-white/70 text-[#192837] font-semibold text-[clamp(0.9rem,2vw,1rem)] border border-white/60 backdrop-blur-md shadow-sm transition-all cursor-pointer"
              >
                <span>View Incident Triage</span>
                <ChevronRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ══ Bottom Footer ═══════════════════════════════════════════════ */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-[var(--color-text)] opacity-60">
        City Eye — AI Video Analytics Prototype &copy; {new Date().getFullYear()} · Nagpur Smart CCTV Network
      </footer>
    </div>
  );
}
