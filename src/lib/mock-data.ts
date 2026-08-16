import { Camera, Alert, DailyStat, AlertEventType, AlertStatus } from "./types";

// ── Cameras with Real CCTV Motorcycle Helmet Video Streams ───────────
export const cameras: Camera[] = [
  {
    id: "CAM-001",
    name: "Wardha Road Junction",
    location: { lat: 21.1256, lng: 79.0725 },
    status: "online",
    fps: 30,
    videoSrc: "/videos/helmet_traffic_raw.mp4",
    junctionType: "Arterial Highway Two-Wheeler Checkpoint",
  },
  {
    id: "CAM-002",
    name: "Sitabuldi Square",
    location: { lat: 21.1458, lng: 79.0882 },
    status: "online",
    fps: 25,
    videoSrc: "/videos/helmet_traffic_raw.mp4",
    junctionType: "Commercial Metro Plaza Two-Wheeler Lane",
  },
  {
    id: "CAM-003",
    name: "Dharampeth Circle",
    location: { lat: 21.1432, lng: 79.0652 },
    status: "online",
    fps: 30,
    videoSrc: "/videos/helmet_detection_stream.mp4",
    junctionType: "High-Density Traffic Intersection",
  },
  {
    id: "CAM-004",
    name: "Ambazari Lake Road",
    location: { lat: 21.1349, lng: 79.0498 },
    status: "online",
    fps: 28,
    videoSrc: "/videos/helmet_traffic_raw.mp4",
    junctionType: "Boulevard & Waterfront Checkpoint",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────
function randomItem<T>(arr: T[] | readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

let alertCounter = 100;

const SAMPLE_PLATES = [
  "MH-31-BK-4091",
  "MH-31-EF-8821",
  "MH-40-AQ-1204",
  "MH-31-TR-9902",
  "MH-49-CC-3419",
  "MH-31-ZZ-7711",
  "MH-31-DX-5509",
  "MH-31-HN-2388",
  "MH-31-PZ-6120",
];

export function getEventLabel(type: AlertEventType = "no_helmet"): string {
  return "Non-Helmet Violation (Two-Wheeler)";
}

function snapshotUrl(riderCount = 1): string {
  const subtitle = riderCount === 1 ? "1 RIDER WITHOUT HELMET" : riderCount === 2 ? "2 RIDERS WITHOUT HELMET" : "TRIPLE RIDING (NO HELMET)";
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect fill='%2310141E' width='320' height='180'/><rect x='45' y='25' width='100' height='75' rx='6' fill='none' stroke='%23FF3B30' stroke-width='2.5' stroke-dasharray='5'/><circle cx='95' cy='48' r='14' fill='rgba(255,59,48,0.2)' stroke='%23FF3B30' stroke-width='2'/><text x='160' y='136' fill='%23FF3B30' font-size='10.5' font-family='monospace' font-weight='bold' text-anchor='middle'>YOLOv8 + VGG16: ${subtitle}</text><text x='160' y='156' fill='white' font-size='9' font-family='monospace' text-anchor='middle'>SECTION 194D MV ACT</text></svg>`;
}

export function generateAlert(overrides?: Partial<Alert>): Alert {
  alertCounter++;
  const cam = randomItem(cameras);
  const now = new Date();
  const detectedOffset = randomInt(0, 120);
  const detectedAt = new Date(now.getTime() - detectedOffset * 1000);
  const latencyMs = Math.random() < 0.15
    ? randomInt(25000, 32000)
    : randomInt(3000, 18000);
  const deliveredAt = new Date(detectedAt.getTime() + latencyMs);

  const riderCount = randomItem([1, 1, 1, 2, 2, 3] as const);
  const vehicleType = randomItem(["Motorcycle", "Scooter", "Moped"] as const);
  const fineAmountInr = riderCount * 1000;
  const yoloConfidence = parseFloat((0.92 + Math.random() * 0.07).toFixed(2));
  const vgg16Confidence = parseFloat((0.94 + Math.random() * 0.05).toFixed(2));

  return {
    id: `ALT-${alertCounter}`,
    cameraId: cam.id,
    cameraName: cam.name,
    eventType: "no_helmet",
    confidence: vgg16Confidence,
    yoloConfidence,
    vgg16Confidence,
    trackId: `TRK-MOTO-${randomInt(100, 999)}`,
    detectedAt: detectedAt.toISOString(),
    deliveredAt: deliveredAt.toISOString(),
    latencyMs,
    status: "new",
    snapshotUrl: snapshotUrl(riderCount),
    vehicleType,
    riderCount,
    licensePlate: randomItem(SAMPLE_PLATES),
    fineAmountInr,
    lawSection: `Motor Vehicles Act Section 194D (${riderCount} rider${riderCount > 1 ? "s" : ""} without protective headgear)`,
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
    const riderCount = randomItem([1, 1, 1, 2, 2, 3] as const);
    const vehicleType = randomItem(["Motorcycle", "Scooter", "Moped"] as const);
    const fineAmountInr = riderCount * 1000;
    const yoloConfidence = parseFloat((0.91 + Math.random() * 0.08).toFixed(2));
    const vgg16Confidence = parseFloat((0.93 + Math.random() * 0.06).toFixed(2));

    alertCounter++;
    alerts.push({
      id: `ALT-${alertCounter}`,
      cameraId: cam.id,
      cameraName: cam.name,
      eventType: "no_helmet",
      confidence: vgg16Confidence,
      yoloConfidence,
      vgg16Confidence,
      trackId: `TRK-MOTO-${randomInt(100, 999)}`,
      detectedAt: detectedAt.toISOString(),
      deliveredAt: deliveredAt.toISOString(),
      latencyMs,
      status,
      snapshotUrl: snapshotUrl(riderCount),
      vehicleType,
      riderCount,
      licensePlate: randomItem(SAMPLE_PLATES),
      fineAmountInr,
      lawSection: `Motor Vehicles Act Section 194D (${riderCount} rider${riderCount > 1 ? "s" : ""} without protective headgear)`,
      acknowledgedBy: status !== "new" ? randomItem(["Officer S. Sharma", "Operator Deshmukh", "Traffic In-Charge Patil"]) : undefined,
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
        const count = h >= 7 && h <= 21 ? randomInt(2, 12) : randomInt(0, 3);
        hourly.push({ hour: h, count });
        total += count;
      }

      stats.push({
        cameraId: cam.id,
        date: dateStr,
        totalAlerts: total,
        avgLatencyMs: randomInt(4000, 14000),
        falsePositiveRate: parseFloat((Math.random() * 0.04).toFixed(3)),
        resolvedRate: parseFloat((0.88 + Math.random() * 0.10).toFixed(3)),
        hourlyBreakdown: hourly,
      });
    }
  }

  return stats;
}
