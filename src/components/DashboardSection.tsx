"use client";

import { useState } from "react";
import {
  Building2,
  FileSignature,
  Users,
  TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";
import PropertiesTable from "./PropertiesTable";
import LeadsPanel from "./LeadsPanel";
import PerformanceChart from "./PerformanceChart";
import {
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  Property,
  Lead,
  fmtEur,
} from "@/lib/data";

export default function DashboardSection() {
  const [properties, setProperties] =
    useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  // Derived stats
  const actifs = properties.filter((p) => p.status === "Actif").length;
  const compromis = properties.filter((p) => p.status === "Compromis");
  const volCompromis = compromis.reduce((s, p) => s + p.price, 0);
  const pendingLeads = leads.filter((l) => l.status === "Nouveau").length;
  const caEstime = properties
    .filter((p) => p.status !== "Vendu")
    .reduce((s, p) => s + p.price * 0.04, 0);

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
          value={fmtEur(volCompromis)}
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
          value={fmtEur(caEstime)}
          sub="Commissions potentielles (4 %)"
          trend="+8% vs objectif"
          trendUp
        />
      </div>

      {/* Properties table */}
      <PropertiesTable
        properties={properties}
        setProperties={setProperties}
      />

      {/* Bottom row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <LeadsPanel leads={leads} setLeads={setLeads} />
        <PerformanceChart />
      </div>
    </main>
  );
}
