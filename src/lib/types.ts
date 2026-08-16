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

export type AlertEventType =
  | "no_helmet"
  | "wrong_side"
  | "illegal_parking"
  | "loitering"
  | "wrong_way"
  | "crowd_density"
  | "speed_violation";

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
  vehicleType?: "Motorcycle" | "Car" | "Auto-Rickshaw" | "Truck" | "Pedestrian";
  licensePlate?: string;
  speedKmph?: number;
  headingAngle?: number;
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
  type: "motorcycle_no_helmet" | "motorcycle_helmet" | "car_wrong_side" | "car_normal" | "auto_wrong_side" | "pedestrian";
  x: number; // percentage (0-100)
  y: number;
  width: number;
  height: number;
  confidence: number;
  speedKmph: number;
  headingAngle: number;
  isViolation: boolean;
  violationType?: "no_helmet" | "wrong_side" | "speed_violation";
  label: string;
  licensePlate?: string;
  trailPoints?: { x: number; y: number }[];
}
