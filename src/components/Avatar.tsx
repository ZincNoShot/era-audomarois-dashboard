"use client";

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export default function Avatar({ initials, color, size = 28 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "22",
        border: `1.5px solid ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: size * 0.36,
          fontWeight: 500,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        {initials}
      </span>
    </div>
  );
}
