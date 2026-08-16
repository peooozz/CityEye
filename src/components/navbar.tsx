"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Activity } from "lucide-react";
import { Logo } from "@/components/logo";

interface NavbarProps {
  variant?: "glass-light" | "glass-dark";
}

export const navLinks = [
  { name: "Live Feeds", href: "/feeds", description: "Real-time CCTV stream with YOLOv8 + VGG16 Helmet HUD" },
  { name: "Non-Helmet Triage", href: "/incidents", description: "Live Non-Helmet detection & automated Section 194D Challans" },
  { name: "Compliance Analytics", href: "/analytics", description: "Two-wheeler helmet compliance & violation rate trends" },
  { name: "Checkpoints", href: "/junctions", description: "Nagpur smart camera checkpoint nodes & VGG16 calibration" },
  { name: "Model Telemetry", href: "/system-health", description: "YOLOv8 + VGG16 + ANPR OCR inference engine status" },
];

export function Navbar({ variant = "glass-light" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 w-full max-w-[1360px] mx-auto px-4 sm:px-6">
      {/* ══ Floating Cylinder Ultra-Transparent White Glassmorphism Container ════════════════════════════ */}
      <div className="w-full rounded-full flex items-center justify-between px-3 sm:px-5 py-2 transition-all duration-300 bg-white/40 backdrop-blur-3xl border border-white/70 shadow-[0_8px_32px_rgba(25,40,55,0.06),inset_0_1px_2px_rgba(255,255,255,0.8)]">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Logo size="sm" variant="light" />
        </Link>

        {/* Center: Desktop Cylinder Glassmorphism Hover Navigation Buttons */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/30 border border-white/50 backdrop-blur-md">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href === "/feeds" && pathname === "/dashboard");
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#7342E2] text-white shadow-[0_4px_16px_rgba(115,66,226,0.35)]"
                      : "text-[#192837]/80 hover:text-[#192837] hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-[0_2px_12px_rgba(255,255,255,0.5)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCylinderPill"
                      className="absolute inset-0 rounded-full bg-[#7342E2] -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="flex items-center gap-1.5">
                    {item.name === "Live Feeds" && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-emerald-500"} animate-pulse`} />
                    )}
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Buttons in Cylinder Glass Style */}
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/feeds">
            <motion.button
              whileHover={{ scale: 1.03, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full text-white bg-[#7342E2] shadow-[0_4px_16px_rgba(115,66,226,0.3)] hover:shadow-[0_6px_20px_rgba(115,66,226,0.4)] transition-all cursor-pointer"
            >
              <span>Live Console</span>
              <ArrowRight size={13} />
            </motion.button>
          </Link>

          <Link href="/system-health">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-white/50 hover:bg-white/80 text-[#192837] border border-white/70 shadow-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Activity size={13} className="text-[#3DD68C]" />
              <span className="hidden md:inline">Online</span>
            </motion.button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-full text-[#192837] hover:bg-white/50 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ══ Mobile Slide-In Glass Drawer ═══════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#192837]/30 backdrop-blur-[6px]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[min(90vw,380px)] flex flex-col justify-between p-6 bg-white/90 backdrop-blur-2xl border-l border-white/60 text-[#192837] shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-black/[0.08]">
                  <Logo size="sm" variant="light" />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.06] hover:bg-black/[0.1] text-[#192837] transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 pt-6">
                  {navLinks.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex flex-col gap-0.5 px-4 py-3 rounded-2xl transition-all ${
                            isActive
                              ? "bg-[#7342E2] text-white shadow-md"
                              : "hover:bg-black/[0.04] text-[#192837]/80 hover:text-[#192837]"
                          }`}
                        >
                          <span className="font-semibold text-sm">{item.name}</span>
                          <span className="text-[11px] opacity-75 truncate">{item.description}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom CTAs */}
              <div className="flex flex-col gap-2.5 pt-6 border-t border-black/[0.08]">
                <Link href="/feeds" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-3 rounded-full text-xs font-semibold text-white bg-[#7342E2] shadow-lg hover:bg-[#6434d3] transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>Open Live Console</span>
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
