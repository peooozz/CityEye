"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ size = "md", variant = "light", showText = true }: LogoProps) {
  const s = sizeMap[size];
  const fillColor = variant === "light" ? "#192837" : "#E6E8EC";
  const textColor = variant === "light" ? "text-[#192837]" : "text-[#E6E8EC]";

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <path
          d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z"
          fill={fillColor}
        />
      </svg>
      {showText && (
        <span className={`font-heading ${s.text} ${textColor} tracking-tight font-bold`}>
          City Eye
        </span>
      )}
    </div>
  );
}
