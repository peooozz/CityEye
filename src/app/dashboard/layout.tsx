"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { useDashboardStore } from "@/lib/store";
import { useSimulatedSocket } from "@/lib/simulated-socket";
import { cameras } from "@/lib/mock-data";
import { ChevronLeft, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";

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
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/analytics", label: "Analytics" },
    ...(role === "Admin"
      ? [{ href: "/dashboard/admin", label: "Admin" }]
      : []),
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b flex items-center justify-between px-4 md:px-6 h-14"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronLeft size={14} />
          Back to site
        </Link>
        <div className="w-px h-5" style={{ background: "var(--border-subtle)" }} />
        <Logo size="sm" variant="dark" />
        <span
          className="text-xs hidden sm:inline"
          style={{ color: "var(--text-muted)" }}
        >
          Operator Console
        </span>
      </div>

      {/* Center */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                background: active ? "rgba(0,132,255,0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* System Status */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-data"
          style={{
            background: "rgba(61,214,140,0.1)",
            color: "var(--accent-green)",
            border: "1px solid rgba(61,214,140,0.2)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#3DD68C] animate-live-pulse" />
          {onlineCams}/{cameras.length} Cameras Online
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-surface-raised)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {role}
            <ChevronDown size={12} />
          </button>
          {showRoleMenu && (
            <div
              className="absolute right-0 mt-1 rounded-lg py-1 min-w-[120px] z-50"
              style={{
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {(["Operator", "Admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleMenu(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-xs cursor-pointer transition-colors"
                  style={{
                    color:
                      r === role
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time */}
        <span
          className="hidden lg:block text-xs font-mono-data"
          style={{ color: "var(--text-muted)" }}
        >
          {time}
        </span>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <User size={14} style={{ color: "var(--text-muted)" }} />
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
    <div
      className="dashboard-theme min-h-screen"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <DashboardNav />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
