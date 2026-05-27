"use client";

import { useState } from "react";
import { Search, Bell, LogOut, ChevronDown } from "lucide-react";
import Avatar from "./Avatar";
import { NavSection, UserSession } from "@/lib/data";

const VIEW_LABELS: Record<NavSection, string> = {
  dashboard:   "Tableau de bord",
  properties:  "Propriétés",
  leads:       "Leads Acquéreurs",
  performance: "Performance Équipe",
  settings:    "Paramètres",
};

const PLACEHOLDERS: Record<NavSection, string> = {
  dashboard:   "Rechercher un mandat, un agent…",
  properties:  "Rechercher par adresse, titre, agent…",
  leads:       "Rechercher un prospect…",
  performance: "Rechercher un agent…",
  settings:    "Rechercher un paramètre…",
};

interface TopbarProps {
  currentView: NavSection;
  userSession: UserSession;
  onLogout: () => void;
  globalSearch: string;
  onSearch: (q: string) => void;
}

// Views where the topbar search actively filters content
const SEARCHABLE_VIEWS: NavSection[] = ["properties", "leads"];

export default function Topbar({ currentView, userSession, onLogout, globalSearch, onSearch }: TopbarProps) {
  const [hasNotif, setHasNotif] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = userSession.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColor = userSession.role === "directeur" ? "#e53e3e" : "#7C3AED";

  return (
    <header
      style={{
        height: 54,
        background: "#0d0d0f",
        borderBottom: "1px solid #1f1f23",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Current section breadcrumb */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#3f3f46",
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {VIEW_LABELS[currentView]}
      </span>

      <div style={{ width: 1, height: 14, background: "#27272a", flexShrink: 0 }} />

      {/* Search */}
      <div style={{ flex: 1, position: "relative" }}>
        <Search
          size={13}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#3f3f46",
            pointerEvents: "none",
          }}
        />
        <input
          value={SEARCHABLE_VIEWS.includes(currentView) ? globalSearch : ""}
          onChange={(e) =>
            SEARCHABLE_VIEWS.includes(currentView) && onSearch(e.target.value)
          }
          placeholder={PLACEHOLDERS[currentView]}
          style={{
            width: "100%",
            maxWidth: 380,
            background: "#18181b",
            border: `1px solid ${globalSearch && SEARCHABLE_VIEWS.includes(currentView) ? "#4f46e5" : "#27272a"}`,
            borderRadius: 8,
            padding: "7px 10px 7px 30px",
            fontSize: 13,
            color: "#e4e4e7",
            transition: "border-color 0.15s",
          }}
        />
      </div>

      {/* Notifications bell */}
      <button
        onClick={() => setHasNotif(false)}
        style={{
          position: "relative",
          background: "transparent",
          border: "1px solid #27272a",
          borderRadius: 8,
          padding: "6px 8px",
          color: "#71717a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Notifications"
      >
        <Bell size={15} />
        {hasNotif && (
          <span
            className="animate-pulse-dot"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #0d0d0f",
            }}
          />
        )}
      </button>

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "4px 10px 4px 6px",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = "#3f3f46")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = "#27272a")
          }
        >
          <Avatar initials={initials} color={avatarColor} size={24} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#e4e4e7", lineHeight: 1.2 }}>
              {userSession.name}
            </div>
            <div style={{ fontSize: 10, color: "#52525b", lineHeight: 1.2 }}>
              {userSession.role === "directeur" ? "Directeur" : "Agent"}
            </div>
          </div>
          <ChevronDown
            size={11}
            color="#52525b"
            style={{
              transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.15s",
            }}
          />
        </button>

        {userMenuOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              style={{ position: "fixed", inset: 0, zIndex: 19 }}
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              className="animate-modal"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                zIndex: 20,
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 10,
                padding: "4px",
                minWidth: 180,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {/* User info header in dropdown */}
              <div
                style={{
                  padding: "10px 12px 8px",
                  borderBottom: "1px solid #27272a",
                  marginBottom: 4,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f4f4f5" }}>
                  {userSession.name}
                </div>
                <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>
                  {userSession.role === "directeur"
                    ? "Directeur Agence"
                    : "Agent Commercial"}
                </div>
              </div>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  onLogout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#fca5a5",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#1c0a0a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                }
              >
                <LogOut size={13} />
                Se déconnecter
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
