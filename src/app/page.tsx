"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Logo } from "@/components/logo";

/* ═══════════════════════════════════════════════════════════════════════
   PART A — PUBLIC LANDING PAGE
   ═══════════════════════════════════════════════════════════════════════ */

// ── Navbar ────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-[30px] z-50 flex justify-center px-4">
      <div className="glass-navbar flex items-center gap-6 px-6 py-3 w-fit">
        <Logo size="sm" variant="light" />

        <div className="hidden md:flex items-center gap-5">
          {["Home", "Features", "Solutions", "Pricing"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <button className="glass-button px-5 py-2 text-sm font-medium text-gray-800 flex items-center gap-2 hover:bg-white/50 transition-all cursor-pointer">
          Request Demo
          <ArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
}

// ── Social Proof Badge ───────────────────────────────────────────────
function SocialProofBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-6"
    >
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#FF801E" stroke="#FF801E" />
        ))}
      </div>
      <span className="text-sm text-gray-600">
        Deployed across 50+ city cameras · 99.2% uptime
      </span>
    </motion.div>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-0">
        {/* LEFT COLUMN — Content */}
        <div className="flex-1 max-w-2xl z-10">
          <SocialProofBadge />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="font-headline text-[40px] md:text-[56px] lg:text-[75px] leading-[1.05] tracking-[-2px] text-gray-950 mb-6"
          >
            See more.{" "}
            <br className="hidden md:block" />
            Respond faster.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg tracking-[-0.5px] text-gray-600 max-w-[480px] mb-8 leading-relaxed"
          >
            AI-powered video analytics that turns Nagpur&apos;s existing CCTV
            network into a real-time alert system — detecting incidents in
            seconds and giving operators the tools to act before they escalate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/dashboard">
              <button className="cta-primary px-8 py-4 text-white font-medium flex items-center gap-3 cursor-pointer">
                View Live Dashboard
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight size={14} className="text-white" />
                </span>
              </button>
            </Link>

            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all"
            >
              Read the deployment whitepaper
            </a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Glassy Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center lg:justify-end relative min-h-[350px] md:min-h-[480px] lg:min-h-[560px]"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[700px] scale-125 mix-blend-screen"
            style={{
              filter:
                "hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)",
            }}
          >
            <source
              src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
              type="video/webm"
            />
          </video>
        </motion.div>
      </div>
    </section>
  );
}

// ── Social Proof Logos ───────────────────────────────────────────────
function LogoStrip() {
  const logos = [
    { name: "NagpurMC", shape: "M12 2L2 22h20L12 2z" },
    { name: "SmartCity", shape: "M2 6h20v12H2z" },
    { name: "TrafficAI", shape: "M12 2a10 10 0 100 20 10 10 0 000-20z" },
    { name: "UrbanGrid", shape: "M2 2l10 10L22 2v20L12 12 2 22V2z" },
    { name: "CivicTech", shape: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-20 mt-8">
      <p className="text-center text-xs uppercase tracking-[3px] text-gray-400 mb-10">
        Trusted by city infrastructure &amp; smart-mobility partners
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-[100px]">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="group cursor-pointer transition-all duration-200"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-400 opacity-50 grayscale group-hover:text-[#0084FF] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-200"
            >
              <path d={logo.shape} />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Empty Sections (anchors for nav) ─────────────────────────────────
function SectionAnchors() {
  return (
    <>
      <section id="features" className="min-h-[1px]" />
      <section id="solutions" className="min-h-[1px]" />
      <section id="pricing" className="min-h-[1px]" />
    </>
  );
}

// ── Page Component ───────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background glow layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{
            background: "rgba(96, 177, 255, 0.18)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: "rgba(49, 154, 255, 0.22)",
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <LogoStrip />
        <SectionAnchors />
      </div>
    </div>
  );
}
