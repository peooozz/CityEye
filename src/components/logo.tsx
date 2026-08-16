"use client";

import { Radar } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const sizeMap = {
  sm: { icon: 18, text: "text-base" },
  md: { icon: 22, text: "text-xl" },
  lg: { icon: 28, text: "text-2xl" },
};

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  const s = sizeMap[size];
  const textColor = variant === "light" ? "text-gray-900" : "text-[#e6e8ec]";

  return (
    <div className="flex items-center gap-2">
      <Radar
        size={s.icon}
        className="text-[#0084FF]"
        strokeWidth={2.5}
      />
      <span className={`font-headline ${s.text} ${textColor} tracking-tight`}>
        NexWatch
      </span>
    </div>
  );
}
