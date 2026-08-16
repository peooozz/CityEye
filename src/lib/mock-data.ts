import { Camera, Alert, DailyStat, AlertEventType, AlertStatus } from "./types";

// ── Cameras ──────────────────────────────────────────────────────────
export const cameras: Camera[] = [
  {
    id: "CAM-001",
    name: "Wardha Road Junction",
    location: { lat: 21.1256, lng: 79.0725 },
    status: "online",
    fps: 30,
  },
  {
    id: "CAM-002",
    name: "Sitabuldi Square",
    location: { lat: 21.1458, lng: 79.0882 },
    status: "online",
    fps: 25,
  },
  {
    id: "CAM-003",
    name: "Dharampeth Circle",
    location: { lat: 21.1432, lng: 79.0652 },
    status: "online",
    fps: 30,
  },
  {
    id: "CAM-004",
    name: "Ambazari Lake Road",
    location: { lat: 21.1349, lng: 79.0498 },
    status: "online",
    fps: 28,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

let alertCounter = 100;

const EVENT_TYPES: AlertEventType[] = [
  "illegal_parking",
  "illegal_parking",
  "illegal_parking",
  "loitering",
  "loitering",
  "wrong_way",
  "crowd_density",
];

const EVENT_LABELS: Record<AlertEventType, string> = {
  illegal_parking: "Illegal Parking",
  loitering: "Loitering Detected",
  wrong_way: "Wrong-Way Movement",
  crowd_density: "Crowd Density Alert",
};

export function getEventLabel(type: AlertEventType): string {
  return EVENT_LABELS[type];
}

// snapshot placeholder (colored SVG data URI per event type)
const SNAPSHOT_COLORS: Record<AlertEventType, string> = {
  illegal_parking: "%23FF4D4F",
  loitering: "%23F5A623",
  wrong_way: "%230084FF",
  crowd_density: "%233DD68C",
};

function snapshotUrl(eventType: AlertEventType): string {
  const c = SNAPSHOT_COLORS[eventType];
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect fill='%23181C25' width='320' height='180'/><rect x='40' y='30' width='100' height='60' rx='4' fill='none' stroke='${c}' stroke-width='2' stroke-dasharray='6'/><text x='160' y='100' fill='${c}' font-size='11' font-family='monospace' text-anchor='middle'>CCTV Frame</text></svg>`;
}

export function generateAlert(overrides?: Partial<Alert>): Alert {
  alertCounter++;
  const cam = randomItem(cameras);
  const eventType = randomItem(EVENT_TYPES);
  const now = new Date();
  const detectedOffset = randomInt(0, 120); // seconds ago
  const detectedAt = new Date(now.getTime() - detectedOffset * 1000);
  const latencyMs = Math.random() < 0.15
    ? randomInt(25000, 32000) // occasional spike
    : randomInt(3000, 18000); // normal range
  const deliveredAt = new Date(detectedAt.getTime() + latencyMs);

  return {
    id: `ALT-${alertCounter}`,
    cameraId: cam.id,
    cameraName: cam.name,
    eventType,
    confidence: parseFloat((0.72 + Math.random() * 0.26).toFixed(2)),
    trackId: `TRK-${randomInt(100, 999)}`,
    detectedAt: detectedAt.toISOString(),
    deliveredAt: deliveredAt.toISOString(),
    latencyMs,
    status: "new",
    snapshotUrl: snapshotUrl(eventType),
    ...overrides,
  };
}

// ── Initial Seed Alerts (last 24 h) ─────────────────────────────────
export function generateSeedAlerts(count = 25): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();
  const statuses: AlertStatus[] = [
    "new", "acknowledged", "resolved", "resolved",
    "acknowledged", "false_positive", "resolved",
  ];

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.random() * 24;
    const detectedAt = new Date(now - hoursAgo * 3600000);
    const latencyMs = Math.random() < 0.12
      ? randomInt(25000, 32000)
      : randomInt(2000, 15000);
    const deliveredAt = new Date(detectedAt.getTime() + latencyMs);
    const status = randomItem(statuses);
    const cam = randomItem(cameras);
    const eventType = randomItem(EVENT_TYPES);

    alertCounter++;
    alerts.push({
      id: `ALT-${alertCounter}`,
      cameraId: cam.id,
      cameraName: cam.name,
      eventType,
      confidence: parseFloat((0.72 + Math.random() * 0.26).toFixed(2)),
      trackId: `TRK-${randomInt(100, 999)}`,
      detectedAt: detectedAt.toISOString(),
      deliveredAt: deliveredAt.toISOString(),
      latencyMs,
      status,
      snapshotUrl: snapshotUrl(eventType),
      acknowledgedBy: status !== "new" ? randomItem(["Operator A", "Operator B", "Admin"]) : undefined,
      resolvedAt: status === "resolved" ? new Date(deliveredAt.getTime() + randomInt(30000, 300000)).toISOString() : undefined,
    });
  }

  return alerts.sort((a, b) =>
    new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );
}

// ── Daily Stats (last 7 days) ────────────────────────────────────────
export function generateDailyStats(): DailyStat[] {
  const stats: DailyStat[] = [];
  const now = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    for (const cam of cameras) {
      const hourly: { hour: number; count: number }[] = [];
      let total = 0;
      for (let h = 0; h < 24; h++) {
        const count = h >= 6 && h <= 22 ? randomInt(0, 8) : randomInt(0, 2);
        hourly.push({ hour: h, count });
        total += count;
      }

      stats.push({
        cameraId: cam.id,
        date: dateStr,
        totalAlerts: total,
        avgLatencyMs: randomInt(4000, 16000),
        falsePositiveRate: parseFloat((Math.random() * 0.18).toFixed(3)),
        resolvedRate: parseFloat((0.75 + Math.random() * 0.23).toFixed(3)),
        hourlyBreakdown: hourly,
      });
    }
  }

  return stats;
}
