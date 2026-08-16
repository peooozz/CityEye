"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "./store";
import { generateAlert } from "./mock-data";

/**
 * Simulated WebSocket — pushes a new random alert every 8-15 seconds
 * into the Zustand store. Runs only once (via ref guard).
 */
export function useSimulatedSocket() {
  const addAlert = useDashboardStore((s) => s.addAlert);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    function scheduleNext() {
      const delay = 8000 + Math.random() * 7000; // 8-15s
      return setTimeout(() => {
        addAlert(generateAlert());
        timerRef = scheduleNext();
      }, delay);
    }

    let timerRef = scheduleNext();

    return () => clearTimeout(timerRef);
  }, [addAlert]);
}
