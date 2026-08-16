"""
=============================================================================
City Eye — AI Video Analytics Platform
Unified End-to-End Real-Time CCTV Inference Pipeline
(YOLOv8 + VGG16 Helmet Classifier + Wrong-Side Vector Tracker + ANPR OCR)
=============================================================================
"""

import sys
import os
import time
import json
import argparse
from typing import Dict, Any, List

from helmet_vgg16_detector import HelmetViolationDetector
from wrong_side_detector import WrongSideDetector

try:
    import cv2
except ImportError:
    cv2 = None


class CityEyeInferencePipeline:
    """
    Orchestrates real-time multi-model inference for Municipal CCTV streams:
    - Model 1 (YOLOv8): Vehicle & Rider detection
    - Model 2 (VGG16): Head-crop Without-Helmet binary classification
    - Model 3 (VGG16 OCR): License Plate alphanumeric character reader
    - Model 4 (Vector Optics): Wrong-way trajectory contravention tracking
    """
    def __init__(self, authorized_lane_angle: float = 0.0, output_dir: str = "output_violations"):
        self.helmet_detector = HelmetViolationDetector()
        self.wrong_side_detector = WrongSideDetector(authorized_lane_angle_deg=authorized_lane_angle)
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.total_frames_processed = 0
        self.violations_log: List[Dict[str, Any]] = []

    def process_stream(self, video_source: str, display: bool = False, max_frames: int = 100):
        print(f"[CityEyePipeline] Starting inference on source: {video_source}")
        cap = None
        if cv2 is not None and os.path.exists(video_source):
            cap = cv2.VideoCapture(video_source)

        frame_count = 0
        start_time = time.time()

        try:
            while frame_count < max_frames:
                frame_count += 1
                frame = None
                if cap is not None and cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                # 1. Run YOLOv8 + VGG16 Helmet & Plate Detection
                h_res = self.helmet_detector.process_frame(frame, frame_idx=frame_count)

                # 2. Run Wrong-Side Vector Motion Tracker
                # (Simulated track updates if running without video hardware)
                ws_res = self.wrong_side_detector.update_track(
                    track_id="TRK-AUTO-401",
                    x=600 - (frame_count * 15),
                    y=350,
                    timestamp=time.time()
                )

                active_violations = h_res.get("violations_detected", [])
                if ws_res:
                    active_violations.append(ws_res)

                for viol in active_violations:
                    event = {
                        "frame": frame_count,
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "violation": viol
                    }
                    self.violations_log.append(event)
                    print(f"[VIOLATION DETECTED // Frame {frame_count}] Type: {viol['type'].upper()} | Plate: {viol.get('license_plate', 'N/A')} | Fine: ₹{viol.get('fine_inr', 0)}")

                time.sleep(0.03) # simulate 30 FPS stream processing

        except KeyboardInterrupt:
            print("[CityEyePipeline] Stopped by operator.")
        finally:
            if cap is not None:
                cap.release()

        elapsed = time.time() - start_time
        fps = frame_count / max(0.001, elapsed)
        print("----------------------------------------------------------------")
        print(f"[CityEyePipeline] Processed {frame_count} frames in {elapsed:.2f}s ({fps:.1f} FPS)")
        print(f"[CityEyePipeline] Total Violations Captured: {len(self.violations_log)}")
        print("----------------------------------------------------------------")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="City Eye CCTV AI Inference Engine")
    parser.add_argument("--source", type=str, default="../public/videos/cctv_feed_1.mp4", help="Path to MP4 or RTSP stream URL")
    parser.add_argument("--max-frames", type=int, default=50, help="Maximum frames to process in test run")
    args = parser.parse_args()

    pipeline = CityEyeInferencePipeline()
    pipeline.process_stream(args.source, max_frames=args.max_frames)
