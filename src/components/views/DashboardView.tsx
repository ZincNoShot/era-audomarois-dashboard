"use client";

import {
  Building2,
  FileSignature,
  Users,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import Avatar from "@/components/Avatar";
import {
  Property,
  Lead,
  ActivityEntry,
  AGENTS,
  AGENT_BASE_STATS,
  AGENT_MONTHLY_OBJECTIVE,
  ACTIVITY_ICON,
  formatCurrency,
  relativeDate,
} from "@/lib/data";

interface DashboardViewProps {
  properties: Property[];
  leads: Lead[];
  activity: ActivityEntry[];
}

export default function DashboardView({
  properties,
  leads,
  activity,
}: DashboardViewProps) {
  const actifs      = properties.filter((p) => p.status === "Actif").length;
  const compromis   = properties.filter((p) => p.status === "Compromis");
  const volCompromis = compromis.reduce((s, p) => s + p.price, 0);
  const pendingLeads = leads.filter((l) => l.status === "Nouveau").length;
  const caEstime    = properties
    .filter((p) => p.status !== "Vendu")
    .reduce((s, p) => s + p.price * 0.04, 0);

  const maxVol = Math.max(...AGENTS.map((a) => AGENT_BASE_STATS[a.id]?.volume ?? 0));

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
      {/* Page title */}
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
          }}
        >
          Tableau de bord
        </h1>
        <p style={{ fontSize: 13, color: "#52525b", marginTop: 2 }}>
          Vue d&apos;ensemble · Agence de l&apos;Audomarois
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard
          Icon={Building2}
          label="Mandats Actifs"
          value={actifs}
          sub="Sur le secteur Audomarois"
          trend="+12% ce mois"
          trendUp
        />
        <StatCard
          Icon={FileSignature}
          label="Compromis Signés"
          value={formatCurrency(volCompromis)}
          sub={`${compromis.length} bien${compromis.length !== 1 ? "s" : ""} en cours notaire`}
          trend="+3 ce trimestre"
          trendUp
        />
        <StatCard
          Icon={Users}
          label="Leads en Attente"
          value={pendingLeads}
          sub="Appels entrants non traités"
          trend={pendingLeads > 2 ? "⚠ À rappeler" : undefined}
          trendUp={false}
        />
        <StatCard
          Icon={TrendingUp}
          label="C.A. Estimé"
          value={formatCurrency(caEstime)}
          sub="Commissions potentielles (4%)"
          trend="+8% vs objectif"
          trendUp
        />
      </div>

      {/* Bottom section: performance bars + activity log */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Performance overview */}
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
              Performance Équipe
            </div>
            <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
              Volume généré · Exercice en cours
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[...AGENTS]
              .sort(
                (a, b) =>
                  (AGENT_BASE_STATS[b.id]?.volume ?? 0) -
                  (AGENT_BASE_STATS[a.id]?.volume ?? 0)
              )
              .map((agent, i) => {
                const stats = AGENT_BASE_STATS[agent.id] ?? { volume: 0, ventes: 0 };
                const pct = maxVol > 0 ? (stats.volume / maxVol) * 100 : 0;
                return (
                  <div key={agent.id}>
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
                      <Avatar initials={agent.initials} color={agent.color} size={26} />
                      <span
                        style={{
                          fontSize: 13,
                          color: "#d4d4d8",
                          flex: 1,
                          fontWeight: 500,
                        }}
                      >
                        {agent.name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontVariantNumeric: "tabular-nums",
                          fontFamily: "var(--font-geist-mono), monospace",
                          color: "#a1a1aa",
                        }}
                      >
                        {formatCurrency(stats.volume)}
                      </span>
                      <span style={{ fontSize: 11, color: "#52525b" }}>
                        {stats.ventes} vente{stats.ventes !== 1 ? "s" : ""}
                      </span>
                    </div>
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
                        className="animate-bar"
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: agent.color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

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
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {formatCurrency(
                  AGENTS.reduce((s, a) => s + (AGENT_BASE_STATS[a.id]?.volume ?? 0), 0)
                )}
              </div>
              <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
                Volume total
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#f4f4f5" }}>
                {AGENTS.reduce((s, a) => s + (AGENT_BASE_STATS[a.id]?.ventes ?? 0), 0)}
              </div>
              <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
                Ventes clôturées
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#86efac" }}>
                {formatCurrency(
                  AGENTS.reduce(
                    (s, a) => s + (AGENT_BASE_STATS[a.id]?.volume ?? 0) * 0.04,
                    0
                  )
                )}
              </div>
              <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
                Commissions (4%)
              </div>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1f1f23",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
              Journal d&apos;Activité
            </div>
            <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
              Mises à jour récentes — toutes sections
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {activity.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#3f3f46",
                  fontSize: 13,
                }}
              >
                Aucune activité enregistrée.
              </div>
            ) : (
              activity.map((entry) => (
                <div
                  key={entry.id}
                  className="animate-fade-in"
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #18181b",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {ACTIVITY_ICON[entry.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#d4d4d8",
                        lineHeight: 1.4,
                      }}
                    >
                      {entry.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#52525b",
                        marginTop: 3,
                      }}
                    >
                      {relativeDate(entry.ts)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Properties summary table */}
      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #1f1f23",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
              Mandats Récents
            </div>
            <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
              {properties.length} bien{properties.length !== 1 ? "s" : ""} en portefeuille
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0d0d0f" }}>
                {["Propriété", "Prix", "Agent", "Mis à jour"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "9px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#52525b",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #1f1f23",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...properties]
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 5)
                .map((p) => {
                  const agent = AGENTS.find((a) => a.id === p.agentId);
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: "1px solid #18181b" }}
                    >
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>
                          {p.address}
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#e4e4e7",
                            fontVariantNumeric: "tabular-nums",
                            fontFamily: "var(--font-geist-mono), monospace",
                          }}
                        >
                          {formatCurrency(p.price)}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {agent && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar initials={agent.initials} color={agent.color} size={22} />
                            <span style={{ fontSize: 12, color: "#a1a1aa" }}>
                              {agent.name}
                            </span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ fontSize: 12, color: "#52525b" }}>
                          {relativeDate(p.updatedAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
