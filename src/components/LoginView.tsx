"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronDown, ChevronUp, LogIn } from "lucide-react";
import { authenticate, DEMO_CREDENTIALS, UserSession } from "@/lib/data";

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("L'adresse email est requise."); return; }
    if (!password)      { setError("Le mot de passe est requis."); return; }

    setLoading(true);
    // Simulated async gate (keeps UX honest)
    setTimeout(() => {
      const session = authenticate(email, password);
      setLoading(false);
      if (session) {
        onLogin(session);
      } else {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      }
    }, 420);
  };

  const fillDemo = (type: "directeur" | "agent") => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
    setDemoOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 25% 15%, #1a0505 0%, #0a0a0b 55%), #0a0a0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(229,62,62,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Brand header above card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 28,
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #e53e3e, #c53030)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              boxShadow: "0 0 28px rgba(229,62,62,0.35)",
            }}
          >
            E
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#f4f4f5",
                letterSpacing: "-0.02em",
              }}
            >
              ERA Audomarois
            </div>
            <div style={{ fontSize: 12, color: "#52525b", marginTop: 2 }}>
              Tableau de Bord Interne
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid #1f1f23",
            }}
          >
            <h1
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#f4f4f5",
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              Connexion
            </h1>
            <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>
              Accès réservé aux membres de l&apos;équipe ERA.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Adresse email</label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={13}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#52525b",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="prenom.nom@era-audomarois.fr"
                    autoComplete="email"
                    style={{
                      ...inputBase,
                      paddingLeft: 34,
                      borderColor: error ? "#ef4444" : "#27272a",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={13}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#52525b",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{
                      ...inputBase,
                      paddingLeft: 34,
                      paddingRight: 38,
                      borderColor: error ? "#ef4444" : "#27272a",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#52525b",
                      cursor: "pointer",
                      padding: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#1c0a0a",
                    border: "1px solid #7f1d1d",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 12,
                    color: "#fca5a5",
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "11px 0",
                  borderRadius: 9,
                  background: loading
                    ? "#3f3f46"
                    : "linear-gradient(135deg, #e53e3e, #c53030)",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: loading ? "#71717a" : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  transition: "all 0.15s",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(229,62,62,0.3)",
                  marginTop: 4,
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid #52525b",
                        borderTopColor: "#a1a1aa",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Connexion en cours…
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials section */}
          <div
            style={{
              borderTop: "1px solid #1f1f23",
            }}
          >
            <button
              type="button"
              onClick={() => setDemoOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 28px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "#71717a",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#a1a1aa")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#71717a")
              }
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    boxShadow: "0 0 6px #22c55e",
                  }}
                />
                Identifiants de Démonstration
              </span>
              {demoOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {demoOpen && (
              <div
                className="animate-fade-in"
                style={{
                  padding: "4px 28px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <p style={{ fontSize: 11, color: "#52525b", marginBottom: 4, lineHeight: 1.5 }}>
                  Cliquez sur un profil pour pré-remplir les champs de connexion.
                </p>

                <DemoButton
                  label="Directeur Agence"
                  description="Accès complet — mandats, leads, performance, paramètres"
                  email={DEMO_CREDENTIALS.directeur.email}
                  color="#e53e3e"
                  onClick={() => fillDemo("directeur")}
                />
                <DemoButton
                  label="Agent Commercial"
                  description="Vue filtrée — mandats et leads assignés à Mathieu Bernard"
                  email={DEMO_CREDENTIALS.agent.email}
                  color="#7C3AED"
                  onClick={() => fillDemo("agent")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#3f3f46",
            marginTop: 20,
          }}
        >
          Application interne ERA · Agence de l&apos;Audomarois · Saint-Omer
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function DemoButton({
  label,
  description,
  email,
  color,
  onClick,
}: {
  label: string;
  description: string;
  email: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 14px",
        background: "#18181b",
        border: `1px solid #27272a`,
        borderRadius: 9,
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = color + "55";
        (e.currentTarget as HTMLButtonElement).style.background = "#1c1c1e";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272a";
        (e.currentTarget as HTMLButtonElement).style.background = "#18181b";
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: color + "22",
          border: `1.5px solid ${color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            letterSpacing: "-0.02em",
          }}
        >
          {label.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7" }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#52525b",
            marginTop: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </div>
      </div>
      <span
        style={{
          fontSize: 10,
          color: "#3f3f46",
          background: "#0d0d0f",
          border: "1px solid #1f1f23",
          borderRadius: 5,
          padding: "2px 7px",
          fontFamily: "var(--font-geist-mono), monospace",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Remplir ↵
      </span>
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#a1a1aa",
  marginBottom: 6,
};

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#e4e4e7",
  transition: "border-color 0.15s",
};
