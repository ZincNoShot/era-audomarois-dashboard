// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const LS_PROPERTIES = "era_v2_properties";
export const LS_LEADS      = "era_v2_leads";
export const LS_ACTIVITY   = "era_v2_activity";
export const LS_SESSION    = "era_v2_session";

// ─── Auth Types & Credentials ─────────────────────────────────────────────────

export type UserRole = "directeur" | "agent";

export interface UserSession {
  name: string;
  role: UserRole;
  agentId?: number;
}

interface CredentialRecord {
  email: string;
  password: string;
  session: UserSession;
}

const CREDENTIAL_MAP: CredentialRecord[] = [
  {
    email: "directeur@era-audomarois.fr",
    password: "ERA2024!",
    session: { name: "Directeur Agence", role: "directeur" },
  },
  {
    email: "m.bernard@era-audomarois.fr",
    password: "Agent2024!",
    session: { name: "Mathieu Bernard", role: "agent", agentId: 1 },
  },
  {
    email: "s.vanlaer@era-audomarois.fr",
    password: "Agent2024!",
    session: { name: "Sophie Vanlaer", role: "agent", agentId: 3 },
  },
  {
    email: "d.lecomte@era-audomarois.fr",
    password: "Agent2024!",
    session: { name: "Dimitri Lecomte", role: "agent", agentId: 2 },
  },
];

export function authenticate(
  email: string,
  password: string
): UserSession | null {
  const match = CREDENTIAL_MAP.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase().trim() &&
      c.password === password
  );
  return match ? match.session : null;
}

export const DEMO_CREDENTIALS = {
  directeur: {
    email: "directeur@era-audomarois.fr",
    password: "ERA2024!",
    label: "Directeur Agence",
  },
  agent: {
    email: "m.bernard@era-audomarois.fr",
    password: "Agent2024!",
    label: "Agent Commercial",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type PropertyStatus = "Estimation" | "Actif" | "Compromis" | "Vendu";
export type LeadStatus     = "Nouveau" | "Contacté" | "Qualifié";
export type NavSection     = "dashboard" | "properties" | "leads" | "performance" | "settings";
export type ActivityType   = "lead_added" | "status_changed" | "lead_status_changed" | "property_added";

export interface Agent {
  id: number;
  name: string;
  initials: string;
  color: string;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  agentId: number;
  status: PropertyStatus;
  type: string;
  updatedAt: number;
}

export interface Lead {
  id: number;
  nom: string;
  budget: number;
  secteur: string;
  tel: string;
  status: LeadStatus;
  createdAt: number;
}

export interface ActivityEntry {
  id: number;
  label: string;
  type: ActivityType;
  ts: number;
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  { id: 1, name: "Mathieu Bernard", initials: "MB", color: "#7C3AED" },
  { id: 2, name: "Dimitri Lecomte", initials: "DL", color: "#0891B2" },
  { id: 3, name: "Sophie Vanlaer",  initials: "SV", color: "#059669" },
];

// ─── Initial Data ─────────────────────────────────────────────────────────────

const NOW = Date.now();
const DAY = 86_400_000;

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Maison bourgeoise 6 pièces",
    address: "Centre-ville Saint-Omer",
    price: 345_000,
    agentId: 1,
    status: "Actif",
    type: "Maison",
    updatedAt: NOW - DAY * 2,
  },
  {
    id: 2,
    title: "Pavillon moderne",
    address: "Longuenesse",
    price: 215_000,
    agentId: 2,
    status: "Actif",
    type: "Pavillon",
    updatedAt: NOW - DAY * 5,
  },
  {
    id: 3,
    title: "Appartement T2 Rénové",
    address: "Proche Gare Saint-Omer",
    price: 128_000,
    agentId: 3,
    status: "Compromis",
    type: "Appartement",
    updatedAt: NOW - DAY,
  },
  {
    id: 4,
    title: "Corps de ferme à fort potentiel",
    address: "Clairmarais",
    price: 290_000,
    agentId: 1,
    status: "Estimation",
    type: "Corps de ferme",
    updatedAt: NOW - DAY * 7,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 1,
    nom: "Caroline Dumont",
    budget: 250_000,
    secteur: "Longuenesse",
    tel: "0612345678",
    status: "Nouveau",
    createdAt: NOW - DAY * 3,
  },
  {
    id: 2,
    nom: "François Bertrand",
    budget: 350_000,
    secteur: "Saint-Omer Centre",
    tel: "0798765432",
    status: "Contacté",
    createdAt: NOW - DAY * 6,
  },
  {
    id: 3,
    nom: "Isabelle Morel",
    budget: 150_000,
    secteur: "Arques",
    tel: "0645678901",
    status: "Nouveau",
    createdAt: NOW - DAY,
  },
];

export const INITIAL_ACTIVITY: ActivityEntry[] = [
  {
    id: 1,
    label: "Statut mis à jour : Appartement T2 → Compromis",
    type: "status_changed",
    ts: NOW - DAY,
  },
  {
    id: 2,
    label: "Nouveau lead ajouté : Isabelle Morel",
    type: "lead_added",
    ts: NOW - DAY,
  },
  {
    id: 3,
    label: "Lead contacté : François Bertrand",
    type: "lead_status_changed",
    ts: NOW - DAY * 2,
  },
  {
    id: 4,
    label: "Mandat entré : Maison bourgeoise 6 pièces",
    type: "property_added",
    ts: NOW - DAY * 2,
  },
];

// ─── Agent Performance Base (YTD historical volumes) ──────────────────────────

export const AGENT_MONTHLY_OBJECTIVE = 500_000;

export const AGENT_BASE_STATS: Record<number, { volume: number; ventes: number }> = {
  1: { volume: 1_240_000, ventes: 4 },
  2: { volume:   860_000, ventes: 3 },
  3: { volume:   980_000, ventes: 3 },
};

// ─── Sector Options ───────────────────────────────────────────────────────────

export const SECTEURS = [
  "Saint-Omer Centre",
  "Longuenesse",
  "Arques",
  "Clairmarais",
] as const;

export type Secteur = (typeof SECTEURS)[number];

// ─── Status Configuration ─────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  PropertyStatus,
  { bg: string; border: string; text: string; dot: string }
> = {
  Estimation: { bg: "#1c1917", border: "#78716c", text: "#d6d3d1", dot: "#a8a29e" },
  Actif:      { bg: "#052e16", border: "#16a34a", text: "#86efac", dot: "#22c55e" },
  Compromis:  { bg: "#1e1b4b", border: "#4f46e5", text: "#a5b4fc", dot: "#818cf8" },
  Vendu:      { bg: "#0c0a09", border: "#57534e", text: "#a8a29e", dot: "#78716c" },
};

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { bg: string; border: string; text: string }
> = {
  Nouveau:  { bg: "#052e16", border: "#16a34a", text: "#86efac" },
  Contacté: { bg: "#1e1b4b", border: "#4f46e5", text: "#a5b4fc" },
  Qualifié: { bg: "#422006", border: "#d97706", text: "#fcd34d" },
};

export const STATUS_ORDER: PropertyStatus[] = ["Estimation", "Actif", "Compromis", "Vendu"];
export const LEAD_STATUS_ORDER: LeadStatus[] = ["Nouveau", "Contacté", "Qualifié"];

export const ACTIVITY_ICON: Record<ActivityType, string> = {
  lead_added:          "👤",
  status_changed:      "🔄",
  lead_status_changed: "✅",
  property_added:      "🏠",
};

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const pairs = digits.match(/.{1,2}/g) ?? [];
  return pairs.join(" ");
}

export function relativeDate(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < DAY) return "Aujourd'hui";
  if (diff < 2 * DAY) return "Hier";
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Legacy alias kept for any remaining call-sites
export const fmtEur = formatCurrency;

// ─── Dynamic Agent Stats (base YTD + sold properties) ─────────────────────────

export function computeAgentStats(
  agentId: number,
  properties: Property[]
): { volume: number; ventes: number } {
  const base = AGENT_BASE_STATS[agentId] ?? { volume: 0, ventes: 0 };
  const sold = properties.filter(
    (p) => p.agentId === agentId && p.status === "Vendu"
  );
  return {
    volume: base.volume + sold.reduce((s, p) => s + p.price, 0),
    ventes: base.ventes + sold.length,
  };
}
