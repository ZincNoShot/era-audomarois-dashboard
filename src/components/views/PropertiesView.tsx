"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import Avatar from "@/components/Avatar";
import {
  AGENTS,
  Property,
  PropertyStatus,
  ActivityEntry,
  UserSession,
  STATUS_CONFIG,
  STATUS_ORDER,
  formatCurrency,
  relativeDate,
} from "@/lib/data";

interface PropertiesViewProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  addActivity: (entry: Omit<ActivityEntry, "id">) => void;
  userSession: UserSession;
  externalSearch?: string;
}

type TabFilter = "Tous" | PropertyStatus;
const TABS: TabFilter[] = ["Tous", "Estimation", "Actif", "Compromis", "Vendu"];

const TAB_COUNTS = (props: Property[]) =>
  TABS.reduce(
    (acc, t) => ({
      ...acc,
      [t]: t === "Tous" ? props.length : props.filter((p) => p.status === t).length,
    }),
    {} as Record<TabFilter, number>
  );

export default function PropertiesView({
  properties,
  setProperties,
  addActivity,
  userSession,
  externalSearch = "",
}: PropertiesViewProps) {
  const [tab, setTab] = useState<TabFilter>("Tous");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [agentFilter, setAgentFilter] = useState<string>(
    userSession.role === "agent" && userSession.agentId
      ? String(userSession.agentId)
      : "Tous"
  );

  // Fix 1: track open dropdown AND its fixed screen position
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Close dropdown on any scroll or resize so position stays valid
  useEffect(() => {
    if (openDropdown === null) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openDropdown]);

  const counts = useMemo(() => TAB_COUNTS(properties), [properties]);

  const filtered = useMemo(() => {
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
    // All active query terms (local + global topbar)
    const queries = [search, externalSearch]
      .map((q) => q.toLowerCase().trim())
      .filter(Boolean);

    return properties.filter((p) => {
      if (tab !== "Tous" && p.status !== tab) return false;
      if (p.price < min || p.price > max) return false;
      if (agentFilter !== "Tous" && p.agentId !== parseInt(agentFilter, 10)) return false;
      const agentName = AGENTS.find((a) => a.id === p.agentId)?.name ?? "";
      const hay = `${p.title} ${p.address} ${agentName}`.toLowerCase();
      if (!queries.every((q) => hay.includes(q))) return false;
      return true;
    });
  }, [properties, tab, search, externalSearch, minPrice, maxPrice, agentFilter]);

  const changeStatus = (id: number, newStatus: PropertyStatus) => {
    const prop = properties.find((p) => p.id === id);
    if (!prop || prop.status === newStatus) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: newStatus, updatedAt: Date.now() } : p
      )
    );
    addActivity({
      label: `Statut mis à jour : ${prop.title} → ${newStatus}`,
      type: "status_changed",
      ts: Date.now(),
    });
    setOpenDropdown(null);
  };

  // Fix 1: open dropdown at the button's fixed viewport position
  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (openDropdown === id) {
      setOpenDropdown(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    // If dropdown would clip right edge, shift left
    const left = rect.right + 148 > window.innerWidth ? rect.right - 148 : rect.left;
    setDropdownPos({ top: rect.bottom + 4, left });
    setOpenDropdown(id);
  };

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
      // Close dropdown when clicking anywhere in the main area
      onClick={() => setOpenDropdown(null)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#f4f4f5",
              letterSpacing: "-0.03em",
            }}
          >
            Propriétés
          </h1>
          <p style={{ fontSize: 13, color: "#52525b", marginTop: 2 }}>
            {properties.length} mandat{properties.length !== 1 ? "s" : ""} en portefeuille
            {userSession.role === "agent" && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  padding: "2px 7px",
                  borderRadius: 5,
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#c4b5fd",
                }}
              >
                Filtre : {userSession.name}
              </span>
            )}
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#e53e3e",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Nouveau mandat
        </button>
      </div>

      {/* Status tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "4px",
          background: "#111113",
          borderRadius: 10,
          border: "1px solid #27272a",
          width: "fit-content",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                border: "none",
                background: active ? "#27272a" : "transparent",
                color: active ? "#f4f4f5" : "#71717a",
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              {t}
              <span
                style={{
                  fontSize: 10,
                  background: active ? "#3f3f46" : "#1f1f23",
                  color: active ? "#e4e4e7" : "#52525b",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {counts[t]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 10,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SlidersHorizontal size={13} color="#52525b" />
        <span style={{ fontSize: 12, color: "#52525b" }}>Filtres :</span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Adresse, titre…"
          style={inputStyle}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Prix min €"
            style={{ ...inputStyle, width: 110 }}
          />
          <span style={{ fontSize: 12, color: "#3f3f46" }}>–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Prix max €"
            style={{ ...inputStyle, width: 110 }}
          />
        </div>

        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="Tous">Tous les agents</option>
          {AGENTS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {(search || minPrice || maxPrice || agentFilter !== "Tous") && (
          <button
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
              setAgentFilter("Tous");
            }}
            style={{
              background: "transparent",
              border: "1px solid #3f3f46",
              borderRadius: 6,
              padding: "5px 10px",
              fontSize: 11,
              color: "#71717a",
              cursor: "pointer",
            }}
          >
            Réinitialiser
          </button>
        )}

        {externalSearch && (
          <span
            style={{
              fontSize: 11,
              color: "#a1a1aa",
              padding: "3px 8px",
              borderRadius: 5,
              background: "#18181b",
              border: "1px solid #27272a",
            }}
          >
            Recherche globale : «{externalSearch}»
          </span>
        )}

        <div style={{ marginLeft: "auto", fontSize: 12, color: "#52525b" }}>
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table — overflow:hidden kept for border-radius; dropdown uses position:fixed to escape */}
      <div
        style={{
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0d0d0f" }}>
                {["Propriété", "Type", "Prix", "Agent Assigné", "Statut", "Mis à jour", ""].map(
                  (h) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const agent = AGENTS.find((a) => a.id === p.agentId);
                const cfg = STATUS_CONFIG[p.status];
                const isOpen = openDropdown === p.id;

                // Fix 2: agents can only edit their OWN property rows
                const canEdit =
                  userSession.role === "directeur" ||
                  p.agentId === userSession.agentId;

                return (
                  <tr
                    key={p.id}
                    className="animate-fade-in"
                    style={{ borderBottom: "1px solid #18181b" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "#0d0d0f")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
                        📍 {p.address}
                      </div>
                    </td>

                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#71717a",
                          background: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: 5,
                          padding: "2px 7px",
                        }}
                      >
                        {p.type}
                      </span>
                    </td>

                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e4e4e7",
                          fontVariantNumeric: "tabular-nums",
                          fontFamily: "var(--font-geist-mono), monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(p.price)}
                      </span>
                    </td>

                    <td style={{ padding: "13px 16px" }}>
                      {agent && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar initials={agent.initials} color={agent.color} size={24} />
                          <span style={{ fontSize: 12, color: "#a1a1aa", whiteSpace: "nowrap" }}>
                            {agent.name}
                          </span>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "13px 16px" }}>
                      {canEdit ? (
                        // Interactive dropdown for authorised users
                        <button
                          onClick={(e) => openMenu(e, p.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 9px",
                            borderRadius: 6,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            cursor: "pointer",
                            fontSize: 11,
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
                          {p.status}
                          <span style={{ marginLeft: 2, opacity: 0.5, fontSize: 9 }}>▼</span>
                        </button>
                      ) : (
                        // Read-only badge for agents viewing other people's listings
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 9px",
                            borderRadius: 6,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            fontSize: 11,
                            fontWeight: 500,
                            color: cfg.text,
                            whiteSpace: "nowrap",
                            opacity: 0.7,
                          }}
                          title="Vous ne pouvez modifier que vos propres mandats"
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
                          {p.status}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 12, color: "#52525b" }}>
                        {relativeDate(p.updatedAt)}
                      </span>
                    </td>

                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
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
                padding: "48px",
                textAlign: "center",
                color: "#3f3f46",
                fontSize: 13,
              }}
            >
              Aucun mandat ne correspond aux critères sélectionnés.
            </div>
          )}
        </div>
      </div>

      {/* Fix 1: Dropdown rendered via position:fixed — escapes all overflow:hidden ancestors */}
      {openDropdown !== null && (
        <div
          className="animate-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 1000,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "4px",
            minWidth: 148,
            boxShadow: "0 12px 32px rgba(0,0,0,0.7)",
          }}
        >
          {(() => {
            const prop = properties.find((p) => p.id === openDropdown);
            if (!prop) return null;
            return STATUS_ORDER.map((s) => {
              const sc = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => changeStatus(prop.id, s)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: prop.status === s ? "#27272a" : "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    color: sc.text,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: sc.dot,
                      flexShrink: 0,
                    }}
                  />
                  {s}
                  {prop.status === s && (
                    <span style={{ marginLeft: "auto", fontSize: 10 }}>✓</span>
                  )}
                </button>
              );
            });
          })()}
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "6px 10px",
  fontSize: 12,
  color: "#e4e4e7",
  minWidth: 140,
};
