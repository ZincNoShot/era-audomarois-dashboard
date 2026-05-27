// ─── Types ───────────────────────────────────────────────────────────────────

export type PropertyStatus = "Estimation" | "Actif" | "Compromis" | "Vendu";
export type LeadStatus = "Nouveau" | "Contacté" | "Qualifié";
export type NavSection =
  | "dashboard"
  | "properties"
  | "leads"
  | "performance"
  | "settings";

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
}

export interface Lead {
  id: number;
  nom: string;
  budget: string;
  secteur: string;
  tel: string;
  status: LeadStatus;
}

export interface AgentPerf {
  agent: Agent;
  volume: number;
  ventes: number;
  color: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  { id: 1, name: "Mathieu Bernard", initials: "MB", color: "#7C3AED" },
  { id: 2, name: "Dimitri Lecomte", initials: "DL", color: "#0891B2" },
  { id: 3, name: "Sophie Vanlaer",  initials: "SV", color: "#059669" },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Maison bourgeoise 6 pièces",
    address: "Centre-ville Saint-Omer",
    price: 345_000,
    agentId: 1,
    status: "Actif",
    type: "Maison",
  },
  {
    id: 2,
    title: "Pavillon moderne",
    address: "Longuenesse",
    price: 215_000,
    agentId: 2,
    status: "Actif",
    type: "Pavillon",
  },
  {
    id: 3,
    title: "Appartement T2 Rénové",
    address: "Proche Gare Saint-Omer",
    price: 128_000,
    agentId: 3,
    status: "Compromis",
    type: "Appartement",
  },
  {
    id: 4,
    title: "Corps de ferme à fort potentiel",
    address: "Clairmarais",
    price: 290_000,
    agentId: 1,
    status: "Estimation",
    type: "Corps de ferme",
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 1,
    nom: "Caroline Dumont",
    budget: "200 000 – 250 000 €",
    secteur: "Longuenesse / Saint-Martin",
    tel: "06 12 34 56 78",
    status: "Nouveau",
  },
  {
    id: 2,
    nom: "François Bertrand",
    budget: "300 000 – 350 000 €",
    secteur: "Centre-ville Saint-Omer",
    tel: "07 98 76 54 32",
    status: "Contacté",
  },
  {
    id: 3,
    nom: "Isabelle Morel",
    budget: "100 000 – 150 000 €",
    secteur: "Proche Gare",
    tel: "06 45 67 89 01",
    status: "Nouveau",
  },
];

export const TEAM_PERF: AgentPerf[] = [
  { agent: AGENTS[0], volume: 1_240_000, ventes: 4, color: "#7C3AED" },
  { agent: AGENTS[1], volume:   860_000, ventes: 3, color: "#0891B2" },
  { agent: AGENTS[2], volume:   980_000, ventes: 3, color: "#059669" },
];

// ─── Status Config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  PropertyStatus,
  { bg: string; border: string; text: string; dot: string }
> = {
  Estimation: {
    bg: "#1c1917",
    border: "#78716c",
    text: "#d6d3d1",
    dot: "#a8a29e",
  },
  Actif: {
    bg: "#052e16",
    border: "#16a34a",
    text: "#86efac",
    dot: "#22c55e",
  },
  Compromis: {
    bg: "#1e1b4b",
    border: "#4f46e5",
    text: "#a5b4fc",
    dot: "#818cf8",
  },
  Vendu: {
    bg: "#0c0a09",
    border: "#57534e",
    text: "#a8a29e",
    dot: "#78716c",
  },
};

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { bg: string; border: string; text: string }
> = {
  Nouveau:  { bg: "#052e16", border: "#16a34a", text: "#86efac" },
  Contacté: { bg: "#1e1b4b", border: "#4f46e5", text: "#a5b4fc" },
  Qualifié: { bg: "#422006", border: "#d97706", text: "#fcd34d" },
};

export const STATUS_CYCLE: Record<PropertyStatus, PropertyStatus> = {
  Estimation: "Actif",
  Actif:      "Compromis",
  Compromis:  "Vendu",
  Vendu:      "Estimation",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function fmtEur(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
