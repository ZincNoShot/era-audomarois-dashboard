"use client";

import { useMemo, useState } from "react";
import { UserPlus, X } from "lucide-react";
import Avatar from "@/components/Avatar";
import {
  Lead,
  LeadStatus,
  ActivityEntry,
  UserSession,
  LEAD_STATUS_CONFIG,
  LEAD_STATUS_ORDER,
  SECTEURS,
  formatCurrency,
  formatPhoneNumber,
  relativeDate,
  getInitials,
} from "@/lib/data";

interface LeadsViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  addActivity: (entry: Omit<ActivityEntry, "id">) => void;
  userSession: UserSession;
}

type TabFilter = "Tous" | LeadStatus;
const TABS: TabFilter[] = ["Tous", "Nouveau", "Contacté", "Qualifié"];

const EMPTY_FORM = {
  nom: "",
  budgetStr: "",
  secteur: SECTEURS[0] as string,
  telStr: "",
};

interface FormErrors {
  nom?: string;
  budget?: string;
  tel?: string;
}

export default function LeadsView({ leads, setLeads, addActivity, userSession: _userSession }: LeadsViewProps) {
  const [tab, setTab] = useState<TabFilter>("Tous");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const counts = useMemo(
    () =>
      TABS.reduce(
        (acc, t) => ({
          ...acc,
          [t]: t === "Tous" ? leads.length : leads.filter((l) => l.status === t).length,
        }),
        {} as Record<TabFilter, number>
      ),
    [leads]
  );

  const filtered = useMemo(
    () => (tab === "Tous" ? leads : leads.filter((l) => l.status === tab)),
    [leads, tab]
  );

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.nom.trim()) e.nom = "Le nom complet est requis.";
    const budgetVal = parseInt(form.budgetStr.replace(/\D/g, ""), 10);
    if (!form.budgetStr.trim() || isNaN(budgetVal) || budgetVal <= 0)
      e.budget = "Entrez un budget valide (ex. 250000).";
    const digits = form.telStr.replace(/\D/g, "");
    if (digits.length > 0 && digits.length !== 10)
      e.tel = "Le numéro doit comporter 10 chiffres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const budget = parseInt(form.budgetStr.replace(/\D/g, ""), 10);
    const tel = form.telStr.replace(/\D/g, "");
    const newLead: Lead = {
      id: Date.now(),
      nom: form.nom.trim(),
      budget,
      secteur: form.secteur,
      tel,
      status: "Nouveau",
      createdAt: Date.now(),
    };
    setLeads((prev) => [newLead, ...prev]);
    addActivity({
      label: `Nouveau lead ajouté : ${newLead.nom} — ${formatCurrency(budget)}`,
      type: "lead_added",
      ts: Date.now(),
    });
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(false);
  };

  const changeLeadStatus = (id: number, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === newStatus) return;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    addActivity({
      label: `Lead mis à jour : ${lead.nom} → ${newStatus}`,
      type: "lead_status_changed",
      ts: Date.now(),
    });
  };

  const closedModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const budgetPreview =
    form.budgetStr.replace(/\D/g, "").length > 0
      ? formatCurrency(parseInt(form.budgetStr.replace(/\D/g, ""), 10))
      : null;

  return (
    <>
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
              Leads Acquéreurs
            </h1>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 2 }}>
              {leads.length} prospect{leads.length !== 1 ? "s" : ""} en base
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            <UserPlus size={14} />
            Ajouter un Lead
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
            const cfg = t !== "Tous" ? LEAD_STATUS_CONFIG[t as LeadStatus] : null;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: active ? "#27272a" : "transparent",
                  color: active ? (cfg?.text ?? "#f4f4f5") : "#71717a",
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

        {/* Leads table */}
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
                  {["Prospect", "Budget Maximum", "Secteur", "Téléphone", "Statut", "Ajouté le"].map(
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
                {filtered.map((l) => {
                  const scfg = LEAD_STATUS_CONFIG[l.status] ?? LEAD_STATUS_CONFIG["Nouveau"];
                  return (
                    <tr
                      key={l.id}
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
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={getInitials(l.nom)} color="#6366f1" size={32} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}>
                            {l.nom}
                          </span>
                        </div>
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
                          {formatCurrency(l.budget)}
                        </span>
                      </td>

                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontSize: 12, color: "#a1a1aa" }}>📍 {l.secteur}</span>
                      </td>

                      <td style={{ padding: "13px 16px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#a1a1aa",
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {l.tel ? formatPhoneNumber(l.tel) : "—"}
                        </span>
                      </td>

                      <td style={{ padding: "13px 16px" }}>
                        <select
                          value={l.status}
                          onChange={(e) =>
                            changeLeadStatus(l.id, e.target.value as LeadStatus)
                          }
                          style={{
                            background: scfg.bg,
                            border: `1px solid ${scfg.border}`,
                            color: scfg.text,
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {LEAD_STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontSize: 12, color: "#52525b" }}>
                          {relativeDate(l.createdAt)}
                        </span>
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
                Aucun lead dans cette catégorie.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal overlay */}
      {showModal && (
        <div
          className="animate-backdrop"
          onClick={closedModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            className="animate-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111113",
              border: "1px solid #27272a",
              borderRadius: 14,
              width: "100%",
              maxWidth: 520,
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #1f1f23",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f4f4f5" }}>
                  Nouveau Lead Acquéreur
                </div>
                <div style={{ fontSize: 12, color: "#52525b", marginTop: 2 }}>
                  Tous les champs marqués * sont obligatoires.
                </div>
              </div>
              <button
                onClick={closedModal}
                style={{
                  background: "transparent",
                  border: "1px solid #27272a",
                  borderRadius: 7,
                  padding: "5px 8px",
                  color: "#71717a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom Complet *</label>
                <input
                  value={form.nom}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, nom: e.target.value }));
                    if (errors.nom) setErrors((er) => ({ ...er, nom: undefined }));
                  }}
                  placeholder="ex. Caroline Dupont"
                  style={{
                    ...fieldStyle,
                    borderColor: errors.nom ? "#ef4444" : "#27272a",
                  }}
                />
                {errors.nom && <p style={errorStyle}>{errors.nom}</p>}
              </div>

              {/* Budget */}
              <div>
                <label style={labelStyle}>Budget Maximum *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.budgetStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setForm((f) => ({ ...f, budgetStr: raw }));
                    if (errors.budget) setErrors((er) => ({ ...er, budget: undefined }));
                  }}
                  placeholder="ex. 250000"
                  style={{
                    ...fieldStyle,
                    borderColor: errors.budget ? "#ef4444" : "#27272a",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
                {budgetPreview && (
                  <p style={{ fontSize: 11, color: "#22c55e", marginTop: 4 }}>
                    → {budgetPreview}
                  </p>
                )}
                {errors.budget && <p style={errorStyle}>{errors.budget}</p>}
              </div>

              {/* Secteur */}
              <div>
                <label style={labelStyle}>Secteur Recherché *</label>
                <select
                  value={form.secteur}
                  onChange={(e) => setForm((f) => ({ ...f, secteur: e.target.value }))}
                  style={fieldStyle}
                >
                  {SECTEURS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input
                  type="text"
                  inputMode="tel"
                  value={form.telStr}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      telStr: formatPhoneNumber(e.target.value),
                    }));
                    if (errors.tel) setErrors((er) => ({ ...er, tel: undefined }));
                  }}
                  placeholder="06 XX XX XX XX"
                  style={{
                    ...fieldStyle,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontVariantNumeric: "tabular-nums",
                    borderColor: errors.tel ? "#ef4444" : "#27272a",
                  }}
                />
                {errors.tel && <p style={errorStyle}>{errors.tel}</p>}
              </div>
            </div>

            {/* Modal footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #1f1f23",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={closedModal}
                style={{
                  background: "transparent",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 13,
                  color: "#71717a",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  background: "#e53e3e",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 22px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Enregistrer le lead
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#a1a1aa",
  marginBottom: 6,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#e4e4e7",
};

const errorStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#ef4444",
  marginTop: 4,
};
