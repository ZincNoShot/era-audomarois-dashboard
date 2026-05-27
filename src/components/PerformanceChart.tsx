"use client";

import Avatar from "./Avatar";
import { TEAM_PERF, fmtEur } from "@/lib/data";

export default function PerformanceChart() {
  const maxVol = Math.max(...TEAM_PERF.map((p) => p.volume));
  const totalVol = TEAM_PERF.reduce((s, p) => s + p.volume, 0);
  const totalVentes = TEAM_PERF.reduce((s, p) => s + p.ventes, 0);

  const sorted = [...TEAM_PERF].sort((a, b) => b.volume - a.volume);

  return (
    <div
      style={{
        background: "#111113",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
          Performance Équipe
        </div>
        <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
          Volume généré · Exercice en cours
        </div>
      </div>

      {/* Bars */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}
      >
        {sorted.map((p, i) => (
          <div key={p.agent.id}>
            {/* Row header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#52525b",
                  width: 14,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                #{i + 1}
              </span>
              <Avatar
                initials={p.agent.initials}
                color={p.color}
                size={26}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "#d4d4d8",
                  flex: 1,
                  fontWeight: 500,
                }}
              >
                {p.agent.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "var(--font-geist-mono), monospace",
                  color: "#a1a1aa",
                }}
              >
                {fmtEur(p.volume)}
              </span>
              <span style={{ fontSize: 11, color: "#52525b" }}>
                {p.ventes} vente{p.ventes !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Bar */}
            <div
              style={{
                height: 6,
                background: "#1c1c1e",
                borderRadius: 3,
                overflow: "hidden",
                marginLeft: 24,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(p.volume / maxVol) * 100}%`,
                  background: p.color,
                  borderRadius: 3,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid #1f1f23",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f4f4f5",
              fontVariantNumeric: "tabular-nums",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {fmtEur(totalVol)}
          </div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
            Volume total
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: 18, fontWeight: 600, color: "#f4f4f5" }}
          >
            {totalVentes}
          </div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
            Ventes clôturées
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: 18, fontWeight: 600, color: "#86efac" }}
          >
            +18%
          </div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
            vs mois précédent
          </div>
        </div>
      </div>
    </div>
  );
}
