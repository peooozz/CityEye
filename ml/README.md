# City Eye — AI Video Analytics (YOLOv8 + VGG16 + ANPR Subsystem)

This directory contains the Python machine learning engine for real-time traffic violation detection on municipal CCTV camera feeds, inspired by the architecture in [ThanhSan97/Helmet-Violation-Detection-Using-YOLO-and-VGG16](https://github.com/ThanhSan97/Helmet-Violation-Detection-Using-YOLO-and-VGG16).

---

## 🚀 Model Architecture & Multi-Stage Pipeline

```
CCTV RTSP / MP4 Video Stream
         │
         ├───► Stage 1: YOLOv8 Object Detection
         │     ├── Detects 'motorcycle', 'car', 'person' (riders/pedestrians)
         │     └── Tracks vehicle bounding boxes & spatio-temporal IDs
         │
         ├───► Stage 2: VGG16 Head-Region Helmet Classifier
         │     ├── Crops upper 30% ROI of rider bounding box (head area)
         │     ├── Normalizes to 224×224×3 RGB tensor
         │     └── Binary classification: [With_Helmet vs Without_Helmet]
         │
         ├───► Stage 3: License Plate Recognition (ANPR via VGG16 OCR)
         │     ├── Crops motorcycle/vehicle lower registration plate region
         │     ├── Preprocessing: Contrast stretching + Adaptive Otsu Binarization
         │     └── Character segmentation & VGG16 character classification (A-Z, 0-9)
         │
         └───► Stage 4: Wrong-Side Directional Vector Tracker
               ├── Computes optical flow velocity vector: v = (dx/dt, dy/dt)
               ├── Evaluates angle discrepancy against authorized lane heading
               └── Flags contravention when cos(angle) < -0.5 (>125° reverse flow)
```

---

## 📦 Directory Structure

- **`helmet_vgg16_detector.py`**: Two-stage YOLOv8 + VGG16 Helmet Classifier & ANPR OCR character recognizer.
- **`wrong_side_detector.py`**: Directional motion vector analyzer and trajectory contravention tracker.
- **`pipeline.py`**: Unified multi-model batch and live stream processor.
- **`api_server.py`**: FastAPI & WebSocket microservice for real-time frontend telemetry integration.
- **`requirements.txt`**: Python library dependencies.

---

## 🛠️ Quickstart Installation & Inference

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run inference on a CCTV stream
python pipeline.py --source ../public/videos/cctv_feed_1.mp4 --max-frames 100

# 3. Launch the FastAPI + WebSocket telemetry server
python api_server.py
```
