"use client";

import { useDashboardStore } from "@/lib/store";
import { cameras } from "@/lib/mock-data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Users,
  Cpu,
  Plus,
  Pencil,
  Shield,
  ShieldCheck,
  Activity,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   Tab Button
   ═══════════════════════════════════════════════════════════════════════ */
function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      style={{
        background: active ? "rgba(0,132,255,0.1)" : "transparent",
        color: active ? "var(--accent-primary)" : "var(--text-secondary)",
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Cameras Tab
   ═══════════════════════════════════════════════════════════════════════ */
function CamerasTab() {
  return (
    <div
      className="rounded-xl border overflow-hidden scanline-texture"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Camera Management
        </span>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          style={{
            background: "rgba(0,132,255,0.15)",
            color: "var(--accent-primary)",
          }}
        >
          <Plus size={12} />
          Add Camera
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {["Camera ID", "Name", "Location", "FPS", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {cameras.map((cam) => (
              <tr
                key={cam.id}
                className="border-b last:border-b-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <td
                  className="px-4 py-3 font-mono-data"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cam.id}
                </td>
                <td
                  className="px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cam.name}
                </td>
                <td
                  className="px-4 py-3 font-mono-data"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cam.location.lat.toFixed(4)}, {cam.location.lng.toFixed(4)}
                </td>
                <td
                  className="px-4 py-3 font-mono-data"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cam.fps}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          cam.status === "online"
                            ? "var(--accent-green)"
                            : "var(--accent-red)",
                      }}
                    />
                    <span
                      className="capitalize"
                      style={{
                        color:
                          cam.status === "online"
                            ? "var(--accent-green)"
                            : "var(--accent-red)",
                      }}
                    >
                      {cam.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] cursor-pointer"
                    style={{
                      background: "var(--bg-surface-raised)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Pencil size={10} />
                    Edit Zone
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Users Tab
   ═══════════════════════════════════════════════════════════════════════ */
const mockUsers = [
  { id: "U-001", name: "Rajesh Kumar", email: "rajesh@nagpur.gov.in", role: "Admin" },
  { id: "U-002", name: "Priya Sharma", email: "priya@nexwatch.ai", role: "Operator" },
  { id: "U-003", name: "Vikram Patel", email: "vikram@nagpur.gov.in", role: "Operator" },
  { id: "U-004", name: "Anita Deshmukh", email: "anita@nexwatch.ai", role: "Admin" },
];

function UsersTab() {
  return (
    <div
      className="rounded-xl border overflow-hidden scanline-texture"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          User Management
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {["ID", "Name", "Email", "Role"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <td
                  className="px-4 py-3 font-mono-data"
                  style={{ color: "var(--text-muted)" }}
                >
                  {user.id}
                </td>
                <td
                  className="px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.name}
                </td>
                <td
                  className="px-4 py-3 font-mono-data"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background:
                        user.role === "Admin"
                          ? "rgba(0,132,255,0.1)"
                          : "rgba(61,214,140,0.1)",
                      color:
                        user.role === "Admin"
                          ? "var(--accent-primary)"
                          : "var(--accent-green)",
                    }}
                  >
                    {user.role === "Admin" ? (
                      <ShieldCheck size={10} />
                    ) : (
                      <Shield size={10} />
                    )}
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   System Health Tab
   ═══════════════════════════════════════════════════════════════════════ */
function RadialGauge({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#232733"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={
            value > 80
              ? "#FF4D4F"
              : value > 60
              ? "#F5A623"
              : "#3DD68C"
          }
          strokeWidth="8"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fill="#E6E8EC"
          fontSize="20"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
        >
          {value}%
        </text>
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fill="#5A6172"
          fontSize="9"
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function SystemHealthTab() {
  return (
    <div className="space-y-4">
      {/* GPU + Model */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-xl border p-6 flex flex-col items-center scanline-texture"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <RadialGauge value={67} label="GPU Utilization" />
        </div>

        <div
          className="rounded-xl border p-4 scanline-texture"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h4
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Model Info
          </h4>
          <div className="space-y-2">
            {[
              ["Detection Model", "YOLOv8n"],
              ["Tracker", "ByteTrack"],
              ["Input Resolution", "1920×1080"],
              ["Batch Size", "4"],
              ["Framework", "TensorRT 8.6"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                <span
                  className="font-mono-data"
                  style={{ color: "var(--text-primary)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl border p-4 scanline-texture"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <h4
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            System Uptime
          </h4>
          <div className="space-y-2">
            {cameras.map((cam) => (
              <div key={cam.id} className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--text-secondary)" }}>
                  {cam.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono-data"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cam.fps} FPS
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--accent-green)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Total Uptime</span>
              <span
                className="font-mono-data"
                style={{ color: "var(--accent-green)" }}
              >
                99.2%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Admin Page (role-gated)
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const role = useDashboardStore((s) => s.role);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cameras" | "users" | "health">(
    "cameras"
  );

  if (role !== "Admin") {
    return (
      <div
        className="flex flex-col items-center justify-center h-[60vh] gap-4"
      >
        <Shield size={48} style={{ color: "var(--text-muted)" }} />
        <h2
          className="text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Admin Access Required
        </h2>
        <p
          className="text-sm text-center max-w-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Switch your role to Admin using the role selector in the top navigation
          to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1
          className="text-xl font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Administration
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Camera management, user roles, and system health
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl w-fit"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <TabButton
          active={activeTab === "cameras"}
          label="Cameras"
          icon={Camera}
          onClick={() => setActiveTab("cameras")}
        />
        <TabButton
          active={activeTab === "users"}
          label="Users"
          icon={Users}
          onClick={() => setActiveTab("users")}
        />
        <TabButton
          active={activeTab === "health"}
          label="System Health"
          icon={Cpu}
          onClick={() => setActiveTab("health")}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "cameras" && <CamerasTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "health" && <SystemHealthTab />}
    </div>
  );
}
