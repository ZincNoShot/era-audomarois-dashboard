"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import Avatar from "./Avatar";
import { NavSection } from "@/lib/data";

interface SidebarProps {
  active: NavSection;
  setActive: (s: NavSection) => void;
}

const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "dashboard",   label: "Tableau de bord",   icon: LayoutDashboard },
  { id: "properties",  label: "Propriétés",         icon: Building2 },
  { id: "leads",       label: "Leads Acquéreurs",   icon: Users },
  { id: "performance", label: "Performance Équipe", icon: BarChart3 },
  { id: "settings",    label: "Paramètres",         icon: Settings },
];

export default function Sidebar({ active, setActive }: SidebarProps) {
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

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
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
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1f1f23",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Avatar initials="DA" color="#e53e3e" size={30} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#e4e4e7" }}>
            Directeur
          </div>
          <div style={{ fontSize: 11, color: "#52525b" }}>Administrateur</div>
        </div>
      </div>
    </aside>
  );
}
