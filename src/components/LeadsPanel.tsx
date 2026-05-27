"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import Avatar from "./Avatar";
import {
  Lead,
  LeadStatus,
  LEAD_STATUS_CONFIG,
  getInitials,
} from "@/lib/data";

interface LeadsPanelProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const EMPTY_FORM = { nom: "", budget: "", secteur: "", tel: "" };

export default function LeadsPanel({ leads, setLeads }: LeadsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!form.nom.trim()) {
      setError("Le nom est requis.");
      return;
    }
    const newLead: Lead = {
      id: Date.now(),
      nom: form.nom.trim(),
      budget: form.budget.trim() || "Non précisé",
      secteur: form.secteur.trim() || "Non précisé",
      tel: form.tel.trim() || "—",
      status: "Nouveau",
    };
    setLeads((prev) => [newLead, ...prev]);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(false);
  };

  const FIELDS: Array<{
    key: keyof typeof EMPTY_FORM;
    label: string;
    placeholder: string;
  }> = [
    { key: "nom",     label: "Nom complet *",       placeholder: "ex. Caroline Dupont" },
    { key: "budget",  label: "Budget (€)",           placeholder: "200 000 – 280 000 €" },
    { key: "secteur", label: "Secteur recherché",    placeholder: "Longuenesse, Saint-Omer…" },
    { key: "tel",     label: "Téléphone",            placeholder: "06 XX XX XX XX" },
  ];

  return (
    <div
      style={{
        background: "#111113",
        border: "1px solid #27272a",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>
            Leads Acquéreurs
          </div>
          <div style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>
            {leads.length} prospect{leads.length !== 1 ? "s" : ""} en file
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setError("");
          }}
          style={{
            background: showForm ? "#18181b" : "#e53e3e",
            border: showForm ? "1px solid #27272a" : "none",
            borderRadius: 7,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: showForm ? "#71717a" : "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.15s",
          }}
        >
          {showForm ? (
            <>
              <X size={13} /> Annuler
            </>
          ) : (
            <>
              <UserPlus size={13} /> Ajouter un Lead
            </>
          )}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="animate-fade-in"
          style={{
            padding: "16px 20px",
            background: "#0d0d0f",
            borderBottom: "1px solid #27272a",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#71717a",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  style={{
                    width: "100%",
                    background: "#18181b",
                    border: `1px solid ${key === "nom" && error ? "#ef4444" : "#27272a"}`,
                    borderRadius: 7,
                    padding: "7px 10px",
                    fontSize: 12,
                    color: "#e4e4e7",
                  }}
                />
              </div>
            ))}
          </div>
          {error && (
            <p style={{ fontSize: 11, color: "#ef4444", marginBottom: 8 }}>
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={handleAdd}
              style={{
                background: "#18181b",
                border: "1px solid #4f46e5",
                borderRadius: 7,
                padding: "6px 16px",
                fontSize: 12,
                color: "#a5b4fc",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Enregistrer le lead
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {leads.map((l) => {
          const scfg =
            LEAD_STATUS_CONFIG[l.status] ?? LEAD_STATUS_CONFIG["Nouveau"];
          return (
            <div
              key={l.id}
              className="animate-fade-in"
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid #18181b",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "#0d0d0f")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "transparent")
              }
            >
              <Avatar
                initials={getInitials(l.nom)}
                color="#6366f1"
                size={32}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}
                >
                  {l.nom}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#52525b",
                    marginTop: 2,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span>💰 {l.budget}</span>
                  <span>📍 {l.secteur}</span>
                  <span>📞 {l.tel}</span>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "3px 8px",
                  borderRadius: 5,
                  background: scfg.bg,
                  border: `1px solid ${scfg.border}`,
                  color: scfg.text,
                  flexShrink: 0,
                }}
              >
                {l.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
