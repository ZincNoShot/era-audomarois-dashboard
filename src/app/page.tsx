"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DashboardSection from "@/components/DashboardSection";
import { NavSection } from "@/lib/data";

export default function Home() {
  const [active, setActive] = useState<NavSection>("dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0a0b",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <Sidebar active={active} setActive={setActive} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar />

        {active === "dashboard" && <DashboardSection />}

        {active !== "dashboard" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Settings size={32} color="#27272a" />
            <p style={{ fontSize: 14, color: "#3f3f46" }}>
              Section en cours de développement
            </p>
            <p style={{ fontSize: 12, color: "#27272a" }}>
              Revenez bientôt — cette page sera disponible prochainement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
