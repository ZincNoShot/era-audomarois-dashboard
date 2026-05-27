"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import {
  AGENTS,
  Property,
  PropertyStatus,
  STATUS_CYCLE,
  fmtEur,
} from "@/lib/data";

interface PropertiesTableProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const ALL_STATUSES: Array<"Tous" | PropertyStatus> = [
  "Tous",
  "Estimation",
  "Actif",
  "Compromis",
  "Vendu",
];

export default function PropertiesTable({
  properties,
  setProperties,
}: PropertiesTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Tous" | PropertyStatus>(
    "Tous"
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return properties.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);
      const matchS = filterStatus === "Tous" || p.status === filterStatus;
      return matchQ && matchS;
    });
  }, [properties, search, filterStatus]);

  const cycleStatus = (id: number) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: STATUS_CYCLE[p.status] } : p
      )
    );
  };

  return (
    <div
      style={{
        background: "#111113",
        border: "1px solid #27272a",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1f1f23",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
            Le Logement Audomarois
          </div>
          <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
            {filtered.length} mandat{filtered.length !== 1 ? "s" : ""} affiché
            {filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={13} color="#52525b" />
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrer par titre, ville..."
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 7,
            padding: "6px 10px",
            fontSize: 12,
            color: "#e4e4e7",
            width: 200,
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "Tous" | PropertyStatus)
          }
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 7,
            padding: "6px 10px",
            fontSize: 12,
            color: "#e4e4e7",
          }}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0d0d0f" }}>
              {[
                "Propriété",
                "Prix",
                "Agent Assigné",
                "Statut",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#52525b",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #1f1f23",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const agent = AGENTS.find((a) => a.id === p.agentId);
              return (
                <tr
                  key={p.id}
                  className="animate-fade-in"
                  style={{
                    borderBottom: "1px solid #18181b",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "#0d0d0f")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "transparent")
                  }
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f4f4f5",
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#52525b",
                        marginTop: 2,
                      }}
                    >
                      📍 {p.address}
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#e4e4e7",
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "var(--font-geist-mono), monospace",
                      }}
                    >
                      {fmtEur(p.price)}
                    </span>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    {agent && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar
                          initials={agent.initials}
                          color={agent.color}
                          size={24}
                        />
                        <span style={{ fontSize: 12, color: "#a1a1aa" }}>
                          {agent.name}
                        </span>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge
                      status={p.status}
                      onClick={() => cycleStatus(p.id)}
                      small
                    />
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "1px solid #27272a",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        color: "#71717a",
                        cursor: "pointer",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ···
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#3f3f46",
              fontSize: 13,
            }}
          >
            Aucun résultat pour cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}
