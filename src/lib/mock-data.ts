import { Camera, Alert, DailyStat, AlertEventType, AlertStatus } from "./types";

// ── Cameras with Real CCTV Video Dataset Sources ─────────────────────
export const cameras: Camera[] = [
  {
    id: "CAM-001",
    name: "Wardha Road Junction",
    location: { lat: 21.1256, lng: 79.0725 },
    status: "online",
    fps: 30,
    videoSrc: "/videos/cctv_feed_1.mp4",
    junctionType: "6-Lane Arterial Highway & Flyover",
  },
  {
    id: "CAM-002",
    name: "Sitabuldi Square",
    location: { lat: 21.1458, lng: 79.0882 },
    status: "online",
    fps: 25,
    videoSrc: "/videos/cctv_hero.mp4",
    junctionType: "High-Density Commercial & Metro Interchange",
  },
  {
    id: "CAM-003",
    name: "Dharampeth Circle",
    location: { lat: 21.1432, lng: 79.0652 },
    status: "online",
    fps: 30,
    videoSrc: "/videos/cctv_feed_1.mp4",
    junctionType: "Rotary Intersection & Market Boulevard",
  },
  {
    id: "CAM-004",
    name: "Ambazari Lake Road",
    location: { lat: 21.1349, lng: 79.0498 },
    status: "online",
    fps: 28,
    videoSrc: "/videos/cctv_hero.mp4",
    junctionType: "Boulevard & Waterfront Expressway",
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
  "no_helmet",
  "wrong_side",
  "no_helmet",
  "wrong_side",
  "illegal_parking",
  "speed_violation",
  "loitering",
  "crowd_density",
];

const EVENT_LABELS: Record<AlertEventType, string> = {
  no_helmet: "No Helmet Detected (Two-Wheeler)",
  wrong_side: "Wrong-Side Driving / Opposite Vector",
  illegal_parking: "Illegal Parking & Dwell Violation",
  loitering: "Restricted Zone Loitering",
  wrong_way: "Wrong-Way Corridor Contradiction",
  crowd_density: "Crowd Surge & Pedestrian Density",
  speed_violation: "Speed Limit Violation (>60 km/h)",
};

export function getEventLabel(type: AlertEventType): string {
  return EVENT_LABELS[type] || type;
}

const SAMPLE_PLATES = [
  "MH-31-BK-4091",
  "MH-31-EF-8821",
  "MH-40-AQ-1204",
  "MH-31-TR-9902",
  "MH-49-CC-3419",
  "MH-31-ZZ-7711",
  "MH-31-DX-5509",
];

// snapshot placeholder (colored SVG data URI per event type)
const SNAPSHOT_COLORS: Record<AlertEventType, string> = {
  no_helmet: "%23FF3B30",
  wrong_side: "%23FF9500",
  illegal_parking: "%23E53E3E",
  loitering: "%23F5A623",
  wrong_way: "%23FF9500",
  crowd_density: "%233DD68C",
  speed_violation: "%23AF52DE",
};

function snapshotUrl(eventType: AlertEventType): string {
  const c = SNAPSHOT_COLORS[eventType] || "%237342E2";
  const label = eventType === "no_helmet" ? "NO HELMET DETECTED" : eventType === "wrong_side" ? "WRONG SIDE VECTOR" : "CCTV ALERT FRAME";
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect fill='%2310141E' width='320' height='180'/><rect x='30' y='25' width='120' height='75' rx='6' fill='none' stroke='${c}' stroke-width='2.5' stroke-dasharray='5'/><circle cx='90' cy='45' r='12' fill='none' stroke='${c}' stroke-width='2'/><text x='160' y='140' fill='${c}' font-size='10' font-family='monospace' font-weight='bold' text-anchor='middle'>${label}</text><text x='160' y='158' fill='white' font-size='9' font-family='monospace' text-anchor='middle'>AI INFERENCE: ACTIVE</text></svg>`;
}

export function generateAlert(overrides?: Partial<Alert>): Alert {
  alertCounter++;
  const cam = randomItem(cameras);
  const eventType = randomItem(EVENT_TYPES);
  const now = new Date();
  const detectedOffset = randomInt(0, 120);
  const detectedAt = new Date(now.getTime() - detectedOffset * 1000);
  const latencyMs = Math.random() < 0.15
    ? randomInt(25000, 32000)
    : randomInt(3000, 18000);
  const deliveredAt = new Date(detectedAt.getTime() + latencyMs);

  const vehicleType: "Motorcycle" | "Car" | "Auto-Rickshaw" | "Truck" | "Pedestrian" = eventType === "no_helmet"
    ? "Motorcycle"
    : eventType === "wrong_side"
    ? (randomItem(["Car", "Auto-Rickshaw", "Motorcycle"] as const))
    : (randomItem(["Car", "Truck", "Auto-Rickshaw"] as const));

  return {
    id: `ALT-${alertCounter}`,
    cameraId: cam.id,
    cameraName: cam.name,
    eventType,
    confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
    trackId: `TRK-${randomInt(100, 999)}`,
    detectedAt: detectedAt.toISOString(),
    deliveredAt: deliveredAt.toISOString(),
    latencyMs,
    status: "new",
    snapshotUrl: snapshotUrl(eventType),
    vehicleType,
    licensePlate: randomItem(SAMPLE_PLATES),
    speedKmph: eventType === "wrong_side" ? randomInt(28, 48) : randomInt(20, 65),
    headingAngle: eventType === "wrong_side" ? randomInt(165, 195) : randomInt(0, 30),
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

    const vehicleType: "Motorcycle" | "Car" | "Auto-Rickshaw" | "Truck" | "Pedestrian" = eventType === "no_helmet"
      ? "Motorcycle"
      : eventType === "wrong_side"
      ? (randomItem(["Car", "Auto-Rickshaw", "Motorcycle"] as const))
      : (randomItem(["Car", "Truck", "Auto-Rickshaw"] as const));

    alertCounter++;
    alerts.push({
      id: `ALT-${alertCounter}`,
      cameraId: cam.id,
      cameraName: cam.name,
      eventType,
      confidence: parseFloat((0.84 + Math.random() * 0.15).toFixed(2)),
      trackId: `TRK-${randomInt(100, 999)}`,
      detectedAt: detectedAt.toISOString(),
      deliveredAt: deliveredAt.toISOString(),
      latencyMs,
      status,
      snapshotUrl: snapshotUrl(eventType),
      vehicleType,
      licensePlate: randomItem(SAMPLE_PLATES),
      speedKmph: eventType === "wrong_side" ? randomInt(28, 48) : randomInt(20, 65),
      headingAngle: eventType === "wrong_side" ? randomInt(165, 195) : randomInt(0, 30),
      acknowledgedBy: status !== "new" ? randomItem(["Officer S. Sharma", "Operator Deshmukh", "Admin Triage"]) : undefined,
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
        const count = h >= 6 && h <= 22 ? randomInt(1, 10) : randomInt(0, 3);
        hourly.push({ hour: h, count });
        total += count;
      }

      stats.push({
        cameraId: cam.id,
        date: dateStr,
        totalAlerts: total,
        avgLatencyMs: randomInt(4000, 16000),
        falsePositiveRate: parseFloat((Math.random() * 0.12).toFixed(3)),
        resolvedRate: parseFloat((0.82 + Math.random() * 0.16).toFixed(3)),
        hourlyBreakdown: hourly,
      });
    }
  }

  return stats;
}
