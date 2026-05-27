"use client";

import { PropertyStatus, STATUS_CONFIG } from "@/lib/data";

interface StatusBadgeProps {
  status: PropertyStatus;
  onClick?: () => void;
  small?: boolean;
}

export default function StatusBadge({
  status,
  onClick,
  small = false,
}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Estimation"];

  return (
    <button
      onClick={onClick}
      title={onClick ? "Cliquer pour changer le statut" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: small ? "3px 8px" : "4px 10px",
        borderRadius: 6,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s",
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        color: cfg.text,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </button>
  );
}
