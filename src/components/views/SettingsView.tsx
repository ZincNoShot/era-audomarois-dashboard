"use client";

import { useState } from "react";
import { Building2, Bell, Palette, Database, Save, RotateCcw, UserPlus } from "lucide-react";
import Avatar from "@/components/Avatar";
import { AGENTS, LS_PROPERTIES, LS_LEADS, LS_ACTIVITY } from "@/lib/data";

interface AgencyInfo {
  name: string;
  address: string;
  city: string;
  siret: string;
  email: string;
  phone: string;
}

const DEFAULT_AGENCY: AgencyInfo = {
  name: "ERA L'Agence de l'Audomarois",
  address: "12 Rue des Épées",
  city: "62500 Saint-Omer",
  siret: "523 456 789 00012",
  email: "contact@era-audomarois.fr",
  phone: "03 21 38 00 00",
};

interface NotifPrefs {
  newLead: boolean;
  statusChange: boolean;
  monthlyReport: boolean;
  teamAlert: boolean;
}

export default function SettingsView() {
  const [agency, setAgency] = useState<AgencyInfo>(DEFAULT_AGENCY);
  const [editMode, setEditMode] = useState(false);
  const [agencyDraft, setAgencyDraft] = useState<AgencyInfo>(DEFAULT_AGENCY);
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState<NotifPrefs>({
    newLead: true,
    statusChange: true,
    monthlyReport: false,
    teamAlert: true,
  });

  const [resetConfirm, setResetConfirm] = useState(false);

  const saveAgency = () => {
    setAgency(agencyDraft);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cancelEdit = () => {
    setAgencyDraft(agency);
    setEditMode(false);
  };

  const resetData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LS_PROPERTIES);
      localStorage.removeItem(LS_LEADS);
      localStorage.removeItem(LS_ACTIVITY);
      window.location.reload();
    }
  };

  const toggleNotif = (key: keyof NotifPrefs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 760,
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
          }}
        >
          Paramètres
        </h1>
        <p style={{ fontSize: 13, color: "#52525b", marginTop: 2 }}>
          Configuration de l&apos;agence et préférences système
        </p>
      </div>

      {/* Agency information */}
      <Section Icon={Building2} title="Informations Agence" subtitle="Données officielles de votre agence ERA">
        {!editMode ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <InfoRow label="Nom" value={agency.name} />
              <InfoRow label="SIRET" value={agency.siret} mono />
              <InfoRow label="Adresse" value={agency.address} />
              <InfoRow label="Ville / CP" value={agency.city} />
              <InfoRow label="Email" value={agency.email} />
              <InfoRow label="Téléphone" value={agency.phone} mono />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setAgencyDraft(agency);
                  setEditMode(true);
                }}
                style={secondaryBtn}
              >
                Modifier
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: "#22c55e", alignSelf: "center" }}>
                  ✓ Enregistré
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {(
                [
                  ["name", "Nom de l'agence"],
                  ["address", "Adresse"],
                  ["city", "Ville / Code Postal"],
                  ["siret", "SIRET"],
                  ["email", "Email"],
                  ["phone", "Téléphone"],
                ] as [keyof AgencyInfo, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    value={agencyDraft[key]}
                    onChange={(e) =>
                      setAgencyDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button onClick={saveAgency} style={primaryBtn}>
                <Save size={13} />
                Enregistrer
              </button>
              <button onClick={cancelEdit} style={secondaryBtn}>
                Annuler
              </button>
            </div>
          </>
        )}
      </Section>

      {/* Team */}
      <Section Icon={Building2} title="Équipe Commerciale" subtitle="Agents actifs sur le secteur Audomarois">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                background: "#0d0d0f",
                border: "1px solid #1f1f23",
                borderRadius: 8,
              }}
            >
              <Avatar initials={agent.initials} color={agent.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#f4f4f5" }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>
                  Agent commercial · ERA Audomarois
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: "3px 8px",
                  borderRadius: 5,
                  background: "#052e16",
                  border: "1px solid #16a34a",
                  color: "#86efac",
                }}
              >
                Actif
              </span>
            </div>
          ))}

          {/* Disabled add-agent placeholder */}
          <div style={{ position: "relative" }}>
            <button
              disabled
              title="Gestion d'équipe globale — Configuration base de données requise en production."
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                width: "100%",
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px dashed #27272a",
                background: "transparent",
                color: "#3f3f46",
                fontSize: 13,
                cursor: "not-allowed",
                marginTop: 4,
              }}
            >
              <UserPlus size={14} />
              Ajouter un Agent
            </button>
            <p
              style={{
                marginTop: 6,
                fontSize: 11,
                color: "#3f3f46",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Gestion d&apos;équipe globale — Configuration base de données requise en production.
            </p>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section Icon={Bell} title="Notifications" subtitle="Gérez les alertes et rapports automatiques">
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <NotifRow
            label="Nouveau lead entrant"
            desc="Alerte lors de l'ajout d'un nouveau prospect"
            checked={notifs.newLead}
            onToggle={() => toggleNotif("newLead")}
          />
          <NotifRow
            label="Changement de statut mandat"
            desc="Notification lors d'une mise à jour de statut"
            checked={notifs.statusChange}
            onToggle={() => toggleNotif("statusChange")}
          />
          <NotifRow
            label="Rapport mensuel"
            desc="Récapitulatif automatique en fin de mois"
            checked={notifs.monthlyReport}
            onToggle={() => toggleNotif("monthlyReport")}
          />
          <NotifRow
            label="Alerte performance équipe"
            desc="Avertissement si un objectif mensuel n'est pas atteint"
            checked={notifs.teamAlert}
            onToggle={() => toggleNotif("teamAlert")}
          />
        </div>
      </Section>

      {/* Display */}
      <Section Icon={Palette} title="Affichage" subtitle="Préférences visuelles de l'interface">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#0d0d0f",
              border: "1px solid #1f1f23",
              borderRadius: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#e4e4e7" }}>Thème</div>
              <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>
                Mode sombre — optimisé pour usage bureau
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 5,
                background: "#18181b",
                border: "1px solid #27272a",
                color: "#71717a",
              }}
            >
              Sombre
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#0d0d0f",
              border: "1px solid #1f1f23",
              borderRadius: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#e4e4e7" }}>Langue</div>
              <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>
                Interface et formats de date en français
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 5,
                background: "#18181b",
                border: "1px solid #27272a",
                color: "#71717a",
              }}
            >
              Français (FR)
            </span>
          </div>
        </div>
      </Section>

      {/* Data management */}
      <Section Icon={Database} title="Gestion des Données" subtitle="Actions sur les données locales de l'application">
        <div
          style={{
            padding: "16px",
            background: "#0c0a09",
            border: "1px solid #57534e",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: "#d6d3d1", marginBottom: 4 }}>
            Réinitialiser les données
          </div>
          <p style={{ fontSize: 12, color: "#78716c", lineHeight: 1.5, marginBottom: 12 }}>
            Cette action supprime toutes les données locales (propriétés, leads, activité) et
            restaure les données initiales de démonstration. Cette opération est irréversible.
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "1px solid #7f1d1d",
                borderRadius: 7,
                padding: "7px 14px",
                fontSize: 12,
                color: "#fca5a5",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={12} />
              Réinitialiser les données
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#fca5a5" }}>
                Confirmer la réinitialisation ?
              </span>
              <button
                onClick={resetData}
                style={{
                  background: "#7f1d1d",
                  border: "none",
                  borderRadius: 7,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fca5a5",
                  cursor: "pointer",
                }}
              >
                Oui, réinitialiser
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                style={secondaryBtn}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}

function Section({
  Icon,
  title,
  subtitle,
  children,
}: {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#111113",
        border: "1px solid #27272a",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1f1f23",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon size={14} color="#52525b" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5" }}>{title}</div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#52525b", marginBottom: 3 }}>{label}</div>
      <div
        style={{
          fontSize: 13,
          color: "#e4e4e7",
          fontFamily: mono ? "var(--font-geist-mono), monospace" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function NotifRow({
  label,
  desc,
  checked,
  onToggle,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#0d0d0f",
        border: "1px solid #1f1f23",
        borderRadius: 8,
        marginBottom: 6,
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: "#e4e4e7" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{desc}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`toggle-track ${checked ? "on" : ""}`}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#71717a",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "7px 10px",
  fontSize: 12,
  color: "#e4e4e7",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#18181b",
  border: "1px solid #4f46e5",
  borderRadius: 7,
  padding: "7px 14px",
  fontSize: 12,
  color: "#a5b4fc",
  cursor: "pointer",
  fontWeight: 500,
};

const secondaryBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #27272a",
  borderRadius: 7,
  padding: "7px 14px",
  fontSize: 12,
  color: "#71717a",
  cursor: "pointer",
};
