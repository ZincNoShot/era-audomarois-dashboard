"use client";

import Avatar from "@/components/Avatar";
import {
  Property,
  Lead,
  UserSession,
  AGENTS,
  AGENT_BASE_STATS,
  AGENT_MONTHLY_OBJECTIVE,
  formatCurrency,
} from "@/lib/data";

interface PerformanceViewProps {
  properties: Property[];
  leads: Lead[];
  userSession: UserSession;
}

export default function PerformanceView({ properties, leads, userSession }: PerformanceViewProps) {
  const teamVolume = AGENTS.reduce(
    (s, a) => s + (AGENT_BASE_STATS[a.id]?.volume ?? 0),
    0
  );
  const teamCommissions = teamVolume * 0.04;
  const teamVentes = AGENTS.reduce(
    (s, a) => s + (AGENT_BASE_STATS[a.id]?.ventes ?? 0),
    0
  );
  const teamObjectifProgress = Math.min(
    (teamVolume / (AGENT_MONTHLY_OBJECTIVE * AGENTS.length)) * 100,
    100
  );

  return (
    <main
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
          }}
        >
          Performance Équipe
        </h1>
        <p style={{ fontSize: 13, color: "#52525b", marginTop: 2 }}>
          Analyse individuelle · Exercice en cours
        </p>
      </div>

      {/* Team summary bar */}
      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 12,
          padding: "18px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 20,
        }}
      >
        <SummaryItem label="Volume Équipe" value={formatCurrency(teamVolume)} accent="#f4f4f5" />
        <SummaryItem
          label="Commissions Totales"
          value={formatCurrency(teamCommissions)}
          accent="#86efac"
        />
        <SummaryItem label="Ventes Clôturées" value={String(teamVentes)} accent="#f4f4f5" />
        <SummaryItem
          label="Objectif Équipe"
          value={`${teamObjectifProgress.toFixed(0)}%`}
          accent={teamObjectifProgress >= 100 ? "#86efac" : "#fcd34d"}
          sub={`Cible : ${formatCurrency(AGENT_MONTHLY_OBJECTIVE * AGENTS.length)}`}
        />
      </div>

      {/* Individual agent cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {[...AGENTS]
          .sort(
            (a, b) =>
              (AGENT_BASE_STATS[b.id]?.volume ?? 0) -
              (AGENT_BASE_STATS[a.id]?.volume ?? 0)
          )
          .map((agent, rank) => {
            const stats = AGENT_BASE_STATS[agent.id] ?? { volume: 0, ventes: 0 };
            const commissions = stats.volume * 0.04;
            const activeListings = properties.filter(
              (p) => p.agentId === agent.id && p.status === "Actif"
            ).length;
            const allListings = properties.filter((p) => p.agentId === agent.id).length;
            const activeLeads = leads.filter((l) => l.status !== "Qualifié").length;
            const objectifPct = Math.min(
              (stats.volume / AGENT_MONTHLY_OBJECTIVE) * 100,
              100
            );
            const volumePctOfTeam =
              teamVolume > 0 ? (stats.volume / teamVolume) * 100 : 0;
            const isMe =
              userSession.role === "agent" && userSession.agentId === agent.id;

            return (
              <div
                key={agent.id}
                className="animate-fade-in"
                style={{
                  background: isMe ? `${agent.color}09` : "#111113",
                  border: `1px solid ${isMe ? agent.color + "44" : "#27272a"}`,
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  boxShadow: isMe ? `0 0 0 1px ${agent.color}22` : "none",
                }}
              >
                {/* Agent header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar initials={agent.initials} color={agent.color} size={48} />
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#0d0d0f",
                        border: `1.5px solid ${agent.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        color: agent.color,
                      }}
                    >
                      #{rank + 1}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#f4f4f5" }}>
                        {agent.name}
                      </span>
                      {isMe && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 5,
                            background: agent.color + "22",
                            border: `1px solid ${agent.color}55`,
                            color: agent.color,
                            letterSpacing: "0.04em",
                          }}
                        >
                          VOUS
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#52525b", marginTop: 2 }}>
                      Agent immobilier · ERA Audomarois
                    </div>
                  </div>
                </div>

                {/* Key metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <MetricChip
                    label="Volume YTD"
                    value={formatCurrency(stats.volume)}
                    color={agent.color}
                  />
                  <MetricChip
                    label="Commissions"
                    value={formatCurrency(commissions)}
                    color="#22c55e"
                  />
                  <MetricChip
                    label="Mandats Actifs"
                    value={`${activeListings} / ${allListings}`}
                    color="#f4f4f5"
                  />
                  <MetricChip
                    label="Ventes Clôturées"
                    value={String(stats.ventes)}
                    color="#f4f4f5"
                  />
                </div>

                {/* Progress bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <ProgressBar
                    label="Objectif Mensuel"
                    pct={objectifPct}
                    value={`${objectifPct.toFixed(0)}%`}
                    color={objectifPct >= 80 ? "#22c55e" : objectifPct >= 50 ? "#f59e0b" : "#ef4444"}
                    sub={`Cible : ${formatCurrency(AGENT_MONTHLY_OBJECTIVE)}`}
                  />
                  <ProgressBar
                    label="Part du Volume Équipe"
                    pct={volumePctOfTeam}
                    value={`${volumePctOfTeam.toFixed(1)}%`}
                    color={agent.color}
                    sub={`${formatCurrency(stats.volume)} / ${formatCurrency(teamVolume)}`}
                  />
                  <ProgressBar
                    label="Taux de Conversion"
                    pct={activeLeads > 0 ? Math.min((stats.ventes / Math.max(activeLeads, 1)) * 100, 100) : 0}
                    value={`${stats.ventes} vente${stats.ventes !== 1 ? "s" : ""}`}
                    color="#818cf8"
                    sub="Ventes sur leads actifs"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}

function SummaryItem({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent: string;
  sub?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: accent,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-geist-mono), monospace",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#52525b", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function MetricChip({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#0d0d0f",
        border: "1px solid #1f1f23",
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  pct,
  value,
  color,
  sub,
}: {
  label: string;
  pct: number;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "#a1a1aa" }}>{label}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#1c1c1e",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          className="animate-bar"
          style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            background: color,
            borderRadius: 3,
          }}
        />
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#52525b", marginTop: 3 }}>{sub}</div>
      )}
    </div>
  );
}
