"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  Icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  Icon,
  label,
  value,
  sub,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        background: "#111113",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#71717a",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <Icon size={14} color="#3f3f46" />
      </div>

      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#f4f4f5",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: "#52525b", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>

      {trend && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            borderRadius: 5,
            background: trendUp ? "#052e16" : "#1c0a09",
            border: `1px solid ${trendUp ? "#166534" : "#7f1d1d"}`,
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: trendUp ? "#86efac" : "#fca5a5",
            }}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
