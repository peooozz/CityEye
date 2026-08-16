"""
=============================================================================
City Eye — AI Video Analytics Platform
Wrong-Side Vehicle & Directional Vector Contravention Detection
=============================================================================

Pipeline Architecture:
1. Spatial Trajectory Tracking (ByteTrack / SORT):
   - Maintains motion history points: [(x0, y0), (x1, y1), ..., (xt, yt)].
2. Direction Vector Estimation:
   - Computes empirical velocity vector: v_measured = (xt - x(t-k), yt - y(t-k))
   - Heading angle: theta_measured = atan2(dy, dx)
3. Lane Direction Contradiction:
   - Compares with authorized lane flow vector v_lane
   - Cosine similarity: cos(phi) = (v_measured . v_lane) / (|v_measured| * |v_lane|)
   - If cos(phi) < -0.5 (angle divergence > 120°), triggers WRONG-WAY ALARM.
4. Speed & Dwell Rate:
   - Evaluates vehicle velocity (km/h) against junction calibration parameters.
=============================================================================
"""

import math
import time
from typing import List, Dict, Tuple, Optional, Any
import numpy as np

class WrongSideDetector:
    """
    Directional Vector & Optical Trajectory Analyzer for traffic lane enforcement.
    """
    def __init__(self, authorized_lane_angle_deg: float = 0.0, speed_calibration_px_per_m: float = 12.0):
        # 0° = East (Right), 90° = South (Down), 180° = West (Left), 270° = North (Up)
        self.lane_angle_rad = math.radians(authorized_lane_angle_deg)
        self.lane_vector = np.array([math.cos(self.lane_angle_rad), math.sin(self.lane_angle_rad)])
        self.px_per_meter = speed_calibration_px_per_m
        self.track_histories: Dict[str, List[Tuple[float, float, float]]] = {} # track_id -> [(x, y, timestamp)]

    def update_track(self, track_id: str, x: float, y: float, timestamp: Optional[float] = None) -> Optional[Dict[str, Any]]:
        """
        Updates a vehicle track and evaluates if it is driving on the wrong side.
        Returns violation dict if contravention detected, otherwise None.
        """
        ts = timestamp or time.time()
        if track_id not in self.track_histories:
            self.track_histories[track_id] = []

        history = self.track_histories[track_id]
        history.append((x, y, ts))

        # Maintain last 15 track positions
        if len(history) > 15:
            history.pop(0)

        # Need at least 4 temporal frames to establish reliable trajectory vector
        if len(history) < 4:
            return None

        # Compute velocity vector from oldest to newest point
        x0, y0, t0 = history[0]
        x1, y1, t1 = history[-1]
        dt = max(0.001, t1 - t0)

        dx = x1 - x0
        dy = y1 - y0
        dist_px = math.hypot(dx, dy)

        # Filter stationary / jittering targets (< 15 px movement)
        if dist_px < 15.0:
            return None

        v_measured = np.array([dx, dy])
        norm_v = np.linalg.norm(v_measured)
        if norm_v == 0:
            return None

        unit_v = v_measured / norm_v

        # Cosine similarity with authorized lane direction
        cos_sim = float(np.dot(unit_v, self.lane_vector))
        angle_diff_deg = math.degrees(math.acos(max(-1.0, min(1.0, cos_sim))))

        # Speed calculation (km/h)
        speed_mps = (dist_px / self.px_per_meter) / dt
        speed_kmph = speed_mps * 3.6

        # Wrong-way criteria: heading opposite to permissible flow (> 125° discrepancy)
        if cos_sim < -0.5:
            return {
                "track_id": track_id,
                "type": "wrong_side",
                "divergence_angle_deg": round(angle_diff_deg, 1),
                "cosine_similarity": round(cos_sim, 3),
                "speed_kmph": round(min(120.0, speed_kmph), 1),
                "current_pos": [x, y],
                "trajectory_history": [(h[0], h[1]) for h in history],
                "severity": "CRITICAL",
                "fine_inr": 5000,
                "law_section": "Motor Vehicles Act Section 184 (Dangerous / Wrong-Way Driving)"
            }

        return None


if __name__ == "__main__":
    print("================================================================")
    print(" City Eye — Wrong-Side Trajectory Vector Analyzer Test")
    print("================================================================")
    # Authorized flow is 0° (Moving Left to Right)
    detector = WrongSideDetector(authorized_lane_angle_deg=0.0)

    # Simulate vehicle moving backwards (180° opposite)
    for i in range(8):
        pos_x = 500 - (i * 25) # moving in negative X direction
        pos_y = 300
        res = detector.update_track("TRK-AUTO-401", x=pos_x, y=pos_y, timestamp=i * 0.1)
        if res:
            print(f"Frame #{i} -> Flagged Infraction:")
            print(f"  * Divergence: {res['divergence_angle_deg']}° | Speed: {res['speed_kmph']} km/h")
            print(f"  * Fine: ₹{res['fine_inr']} ({res['law_section']})")
    print("================================================================")
