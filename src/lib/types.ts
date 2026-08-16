export type CameraStatus = "online" | "offline";

export type Camera = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: CameraStatus;
  fps: number;
  streamUrl?: string;
};

export type AlertEventType =
  | "illegal_parking"
  | "loitering"
  | "wrong_way"
  | "crowd_density";

export type AlertStatus =
  | "new"
  | "acknowledged"
  | "resolved"
  | "false_positive";

export type Alert = {
  id: string;
  cameraId: string;
  cameraName: string;
  eventType: AlertEventType;
  confidence: number;
  trackId: string;
  detectedAt: string;
  deliveredAt: string;
  latencyMs: number;
  status: AlertStatus;
  snapshotUrl: string;
  notes?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
};

export type HourlyBreakdown = {
  hour: number;
  count: number;
};

export type DailyStat = {
  cameraId: string;
  date: string;
  totalAlerts: number;
  avgLatencyMs: number;
  falsePositiveRate: number;
  resolvedRate: number;
  hourlyBreakdown: HourlyBreakdown[];
};

export type UserRole = "Operator" | "Admin";
