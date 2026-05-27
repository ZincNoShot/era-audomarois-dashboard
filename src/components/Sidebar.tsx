"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import Avatar from "./Avatar";
import { NavSection, UserSession } from "@/lib/data";

interface SidebarProps {
  active: NavSection;
  setActive: (s: NavSection) => void;
  userSession: UserSession;
}

const ALL_NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  directorOnly?: boolean;
}[] = [
  { id: "dashboard",   label: "Tableau de bord",   icon: LayoutDashboard },
  { id: "properties",  label: "Propriétés",         icon: Building2 },
  { id: "leads",       label: "Leads Acquéreurs",   icon: Users },
  { id: "performance", label: "Performance Équipe", icon: BarChart3 },
  { id: "settings",    label: "Paramètres",         icon: Settings, directorOnly: true },
];

const ROLE_LABELS: Record<string, string> = {
  directeur: "Directeur Agence",
  agent: "Agent Commercial",
};

export default function Sidebar({ active, setActive, userSession }: SidebarProps) {
  const navItems = ALL_NAV_ITEMS.filter(
    (item) => !item.directorOnly || userSession.role === "directeur"
  );

  const initials = userSession.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColor = userSession.role === "directeur" ? "#e53e3e" : "#7C3AED";

  return (
    <aside
      style={{
        width: 224,
        flexShrink: 0,
        background: "#0d0d0f",
        borderRight: "1px solid #1f1f23",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Branding */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #1f1f23",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg,#e53e3e,#c53030)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            E
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#f4f4f5",
                letterSpacing: "-0.02em",
              }}
            >
              ERA Audomarois
            </div>
            <div style={{ fontSize: 10, color: "#52525b", marginTop: 1 }}>
              Saint-Omer · Artois
            </div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div
        style={{
          margin: "10px 10px 0",
          padding: "7px 10px",
          background:
            userSession.role === "directeur"
              ? "rgba(229,62,62,0.07)"
              : "rgba(124,58,237,0.07)",
          border: `1px solid ${userSession.role === "directeur" ? "rgba(229,62,62,0.18)" : "rgba(124,58,237,0.18)"}`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: userSession.role === "directeur" ? "#e53e3e" : "#7C3AED",
            flexShrink: 0,
            boxShadow: `0 0 5px ${userSession.role === "directeur" ? "#e53e3e" : "#7C3AED"}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: userSession.role === "directeur" ? "#fca5a5" : "#c4b5fd",
            letterSpacing: "0.01em",
          }}
        >
          {ROLE_LABELS[userSession.role] ?? userSession.role}
        </span>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: isActive ? "#18181b" : "transparent",
                color: isActive ? "#f4f4f5" : "#71717a",
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.15s",
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background = "#111113";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <Icon size={15} />
              {label}
              {isActive && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background:
                      userSession.role === "directeur" ? "#e53e3e" : "#7C3AED",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1f1f23",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Avatar initials={initials} color={avatarColor} size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#e4e4e7",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userSession.name}
          </div>
          <div style={{ fontSize: 11, color: "#52525b" }}>
            {ROLE_LABELS[userSession.role]}
          </div>
        </div>
      </div>
    </aside>
  );
}
