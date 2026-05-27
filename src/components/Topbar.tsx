"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import Avatar from "./Avatar";
import { NavSection } from "@/lib/data";

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
}

export default function Topbar({ currentView }: TopbarProps) {
  const [hasNotif, setHasNotif] = useState(true);

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

      <div
        style={{
          width: 1,
          height: 14,
          background: "#27272a",
          flexShrink: 0,
        }}
      />

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
          placeholder={PLACEHOLDERS[currentView]}
          style={{
            width: "100%",
            maxWidth: 380,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "7px 10px 7px 30px",
            fontSize: 13,
            color: "#e4e4e7",
          }}
        />
      </div>

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

      <Avatar initials="DA" color="#e53e3e" size={30} />
    </header>
  );
}
