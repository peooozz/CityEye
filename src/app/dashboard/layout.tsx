"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { useDashboardStore } from "@/lib/store";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { cameras } from "@/lib/mock-data";
import { ChevronLeft, ChevronDown, User, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function DashboardNav() {
  const pathname = usePathname();
  const role = useDashboardStore((s) => s.role);
  const setRole = useDashboardStore((s) => s.setRole);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [time, setTime] = useState("");

  const onlineCams = cameras.filter((c) => c.status === "online").length;

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const navLinks = [
    { href: "/feeds", label: "Live Feeds" },
    { href: "/incidents", label: "Incident Alerts" },
    { href: "/analytics", label: "Analytics" },
    { href: "/junctions", label: "Junctions" },
    { href: "/system-health", label: "System Health" },
    ...(role === "Admin" ? [{ href: "/dashboard/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-2 z-40 px-4 py-2">
      <div
        className="w-full rounded-full flex items-center justify-between px-4 py-2.5 bg-[#12151C]/90 backdrop-blur-2xl border border-[#232733] shadow-xl"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-[#8B93A3] hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Landing Page</span>
          </Link>
          <div className="w-px h-4 bg-[#232733]" />
          <Logo size="sm" variant="dark" />
          <span className="text-[11px] font-mono-data text-[#8B93A3] hidden md:inline">
            Console
          </span>
        </div>

        {/* Center: Cylinder Glassmorphism Navigation Buttons */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.04]">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href === "/feeds" && pathname === "/dashboard");
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-[#7342E2] text-white shadow-[0_4px_14px_rgba(115,66,226,0.35)]"
                      : "text-[#8B93A3] hover:text-white hover:bg-white/[0.08] hover:backdrop-blur-md"
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {/* System Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-data bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {onlineCams}/{cameras.length} Online
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#181C25] hover:bg-[#232733] border border-[#232733] text-[#E6E8EC] transition-colors cursor-pointer"
            >
              <span>{role}</span>
              <ChevronDown size={11} />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-1 rounded-xl py-1 min-w-[120px] bg-[#181C25] border border-[#232733] shadow-2xl z-50">
                {(["Operator", "Admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      r === role ? "text-[#7342E2] font-bold bg-[#7342E2]/10" : "text-[#8B93A3] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Clock */}
          <span className="hidden xl:block text-xs font-mono-data text-[#8B93A3]">
            {time}
          </span>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSimulatedSocket();

  return (
    <div className="dashboard-theme min-h-screen bg-[#0B0E14] text-[#E6E8EC]">
      <DashboardNav />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
