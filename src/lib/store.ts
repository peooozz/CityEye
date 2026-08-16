import { create } from "zustand";
import { Alert, UserRole, AlertStatus } from "./types";
import { generateSeedAlerts, generateDailyStats } from "./mock-data";
import type { DailyStat } from "./types";

interface DashboardState {
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: AlertStatus, by?: string) => void;
  addNote: (id: string, note: string) => void;

  // Role
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Daily stats
  dailyStats: DailyStat[];

  // Selected alert (for detail sheet)
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;

  // Filter
  alertFilter: AlertStatus | "all";
  setAlertFilter: (f: AlertStatus | "all") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  alerts: generateSeedAlerts(25),
  addAlert: (alert) =>
    set((s) => ({ alerts: [alert, ...s.alerts] })),
  updateAlertStatus: (id, status, by) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              acknowledgedBy: by ?? a.acknowledgedBy,
              resolvedAt: status === "resolved" ? new Date().toISOString() : a.resolvedAt,
            }
          : a
      ),
    })),
  addNote: (id, note) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === id ? { ...a, notes: note } : a
      ),
    })),

  role: "Operator",
  setRole: (role) => set({ role }),

  dailyStats: generateDailyStats(),

  selectedAlertId: null,
  setSelectedAlertId: (id) => set({ selectedAlertId: id }),

  alertFilter: "all",
  setAlertFilter: (f) => set({ alertFilter: f }),
}));
