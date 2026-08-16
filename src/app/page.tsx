"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRightCircle,
  Zap,
  LockKeyhole,
  Fingerprint,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";

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

const navItems = [
  { name: "Live Feeds", href: "/dashboard" },
  { name: "Incident Alerts", href: "/dashboard" },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Junctions", href: "/dashboard/admin" },
  { name: "System Health", href: "/dashboard/admin" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between selection:bg-[#7342E2] selection:text-white">
      {/* ══ Background Video ════════════════════════════════════════════ */}
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

      {/* ══ Navbar ══════════════════════════════════════════════════════ */}
      <header className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo size="md" variant="light" />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-[var(--color-text)] transition-opacity hover:opacity-70"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-[#7342E2] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Launch Prototype
            </motion.button>
          </Link>

          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-semibold px-5 py-2.5 rounded-full text-[var(--color-text)] bg-[#F2F2EE] hover:bg-[#EAEAE6] transition-all cursor-pointer"
            >
              Operator Console
            </motion.button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg text-[var(--color-text)] hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* ══ Mobile Menu (Slide-in Sheet) ════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-[rgba(25,40,55,0.35)] backdrop-blur-[4px]"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed right-0 top-0 z-50 h-[100dvh] flex flex-col justify-between py-6 px-6"
              style={{
                width: "min(88vw, 360px)",
                backgroundColor: "#CFC8C5",
                boxShadow: "-12px 0 48px rgba(25,40,55,0.18)",
              }}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-5">
                  <Logo size="sm" variant="light" />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(25,40,55,0.1)] text-[var(--color-text)] hover:bg-[rgba(25,40,55,0.15)] transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-full my-4"
                  style={{ backgroundColor: "rgba(25,40,55,0.12)" }}
                />

                {/* Nav Links */}
                <nav className="flex flex-col gap-2 pt-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: 24, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.18 + i * 0.07,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-[1.1rem] font-medium text-[var(--color-text)] hover:bg-black/10 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Bottom CTAs */}
              <div className="flex flex-col gap-3 pt-6">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-3.5 rounded-full text-[0.95rem] font-semibold text-white bg-[#7342E2] shadow-md hover:bg-[#6434d3] transition-all cursor-pointer">
                    Launch Prototype
                  </button>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full py-3.5 rounded-full text-[0.95rem] font-semibold text-[var(--color-text)] bg-[#F2F2EE] hover:bg-[#EAEAE6] transition-all cursor-pointer">
                    Operator Console
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ Hero Content ════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 pt-[clamp(40px,8vw,72px)] pb-12 flex flex-col items-center justify-center flex-grow">
        <div className="w-full max-w-[720px] mx-auto flex flex-col items-center text-center">
          {/* Hackathon Prototype Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(115,66,226,0.1)] border border-[rgba(115,66,226,0.2)] mb-5"
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
            className="font-heading text-[clamp(1.65rem,5vw,3rem)] leading-[1.05] tracking-[-0.01em] text-[var(--color-text)] mb-6"
          >
            <span className="block whitespace-normal sm:whitespace-nowrap">
              Transform{" "}
              <Zap
                size={24}
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
                size={24}
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
                size={24}
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
            className="font-body text-[clamp(0.9rem,2.5vw,1.1rem)] text-[var(--color-text)] opacity-85 max-w-[580px] leading-[1.65] mb-8"
          >
            Zero blindspots, millisecond response. Autonomous anomaly detection,
            live traffic &amp; crowd monitoring, and instant incident alerts across
            Nagpur&apos;s municipal CCTV network.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full flex justify-center"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  borderRadius: "50px",
                  backgroundColor: "#7342E2",
                  boxShadow: "0 4px 24px rgba(115,66,226,0.28)",
                  minWidth: "240px",
                  padding: "17px 28px",
                }}
                className="flex items-center justify-between gap-8 text-white font-semibold text-[clamp(0.9rem,2vw,1rem)] transition-all cursor-pointer"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRightCircle size={20} className="text-white flex-shrink-0" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ══ Bottom Anchor Space ═════════════════════════════════════════ */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-[var(--color-text)] opacity-60">
        City Eye — AI Video Analytics Prototype &copy; {new Date().getFullYear()} · Nagpur Smart CCTV Network
      </footer>
    </div>
  );
}
