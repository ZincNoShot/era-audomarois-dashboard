"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import LoginView from "@/components/LoginView";
import DashboardView from "@/components/views/DashboardView";
import PropertiesView from "@/components/views/PropertiesView";
import LeadsView from "@/components/views/LeadsView";
import PerformanceView from "@/components/views/PerformanceView";
import SettingsView from "@/components/views/SettingsView";
import {
  NavSection,
  Property,
  Lead,
  ActivityEntry,
  UserSession,
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_ACTIVITY,
  LS_PROPERTIES,
  LS_LEADS,
  LS_ACTIVITY,
  LS_SESSION,
} from "@/lib/data";

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [currentView, setCurrentView] = useState<NavSection>("dashboard");
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate all state from localStorage on mount
  useEffect(() => {
    setUserSession(loadLS<UserSession | null>(LS_SESSION, null));
    setProperties(loadLS(LS_PROPERTIES, INITIAL_PROPERTIES));
    setLeads(loadLS(LS_LEADS, INITIAL_LEADS));
    setActivity(loadLS(LS_ACTIVITY, INITIAL_ACTIVITY));
    setHydrated(true);
  }, []);

  // Persist to localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;
    if (userSession) {
      localStorage.setItem(LS_SESSION, JSON.stringify(userSession));
    } else {
      localStorage.removeItem(LS_SESSION);
    }
  }, [userSession, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_PROPERTIES, JSON.stringify(properties));
  }, [properties, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_LEADS, JSON.stringify(leads));
  }, [leads, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_ACTIVITY, JSON.stringify(activity));
  }, [activity, hydrated]);

  const addActivity = useCallback((entry: Omit<ActivityEntry, "id">) => {
    setActivity((prev) =>
      [{ ...entry, id: Date.now() + Math.random() }, ...prev].slice(0, 60)
    );
  }, []);

  const handleViewChange = useCallback((view: NavSection) => {
    setCurrentView(view);
    setGlobalSearch(""); // clear search when navigating to a new section
  }, []);

  const handleLogin = useCallback((session: UserSession) => {
    setUserSession(session);
    setCurrentView("dashboard");
    setGlobalSearch("");
  }, []);

  const handleLogout = useCallback(() => {
    setUserSession(null);
    setCurrentView("dashboard");
  }, []);

  // Show login screen if no active session
  if (!userSession) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0a0b",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <Sidebar
        active={currentView}
        setActive={handleViewChange}
        userSession={userSession}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar
          currentView={currentView}
          userSession={userSession}
          onLogout={handleLogout}
          globalSearch={globalSearch}
          onSearch={setGlobalSearch}
        />

        {currentView === "dashboard" && (
          <DashboardView
            properties={properties}
            leads={leads}
            activity={activity}
            userSession={userSession}
          />
        )}
        {currentView === "properties" && (
          <PropertiesView
            properties={properties}
            setProperties={setProperties}
            addActivity={addActivity}
            userSession={userSession}
            externalSearch={globalSearch}
          />
        )}
        {currentView === "leads" && (
          <LeadsView
            leads={leads}
            setLeads={setLeads}
            addActivity={addActivity}
            userSession={userSession}
            externalSearch={globalSearch}
          />
        )}
        {currentView === "performance" && (
          <PerformanceView
            properties={properties}
            leads={leads}
            userSession={userSession}
          />
        )}
        {currentView === "settings" && userSession.role === "directeur" && (
          <SettingsView />
        )}
      </div>
    </div>
  );
}
