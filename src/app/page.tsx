"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
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
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_ACTIVITY,
  LS_PROPERTIES,
  LS_LEADS,
  LS_ACTIVITY,
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
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProperties(loadLS(LS_PROPERTIES, INITIAL_PROPERTIES));
    setLeads(loadLS(LS_LEADS, INITIAL_LEADS));
    setActivity(loadLS(LS_ACTIVITY, INITIAL_ACTIVITY));
    setHydrated(true);
  }, []);

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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0a0b",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <Sidebar active={currentView} setActive={setCurrentView} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar currentView={currentView} />

        {currentView === "dashboard" && (
          <DashboardView
            properties={properties}
            leads={leads}
            activity={activity}
          />
        )}
        {currentView === "properties" && (
          <PropertiesView
            properties={properties}
            setProperties={setProperties}
            addActivity={addActivity}
          />
        )}
        {currentView === "leads" && (
          <LeadsView
            leads={leads}
            setLeads={setLeads}
            addActivity={addActivity}
          />
        )}
        {currentView === "performance" && (
          <PerformanceView properties={properties} leads={leads} />
        )}
        {currentView === "settings" && <SettingsView />}
      </div>
    </div>
  );
}
