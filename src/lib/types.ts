export type CameraStatus = "online" | "offline";

export type Camera = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: CameraStatus;
  fps: number;
  streamUrl?: string;
  videoSrc?: string;
  junctionType?: string;
};

export type AlertEventType = "no_helmet";

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
  vgg16Confidence: number;
  yoloConfidence: number;
  trackId: string;
  detectedAt: string;
  deliveredAt: string;
  latencyMs: number;
  status: AlertStatus;
  snapshotUrl: string;
  notes?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  vehicleType: "Motorcycle" | "Scooter" | "Moped";
  riderCount: number;
  licensePlate: string;
  fineAmountInr: number;
  lawSection: string;
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

export interface MLTrackedObject {
  id: string;
  type: "motorcycle_no_helmet" | "motorcycle_helmet" | "motorcycle_triple_no_helmet";
  x: number; // percentage (0-100)
  y: number;
  width: number;
  height: number;
  yoloConfidence: number;
  vgg16Confidence: number;
  isViolation: boolean;
  violationType: "no_helmet";
  label: string;
  licensePlate: string;
  riderCount: number;
  headCropY?: number;
  headCropHeight?: number;
}
