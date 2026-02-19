"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthManager, DataManager } from "@/lib/dataManager";
import type { Admin, AppData, Match, Result, Player, Stat, MediaItem, Notification, PageName } from "@/types";

// UI Components
import LoginPage from "@/components/pages/LoginPage";
import DashboardPage from "@/components/pages/DashboardPage";
import MatchesPage from "@/components/pages/MatchesPage";
import ResultsPage from "@/components/pages/ResultsPage";
import StatsPage from "@/components/pages/StatsPage";
import MediaPage from "@/components/pages/MediaPage";
import TeamsPage from "@/components/pages/TeamsPage";
import NotificationsPage from "@/components/pages/NotificationsPage";
import ArchivesPage from "@/components/pages/ArchivesPage";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Modal from "@/components/ui/Modal";

// Shadcn UI Toast
import { useToast } from "@/hooks/use-toast";
import { Toast } from "radix-ui";
import { Toaster } from "./ui/toaster";

export default function IskoArena() {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");
  const [data, setData] = useState<AppData | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  
  // Initialize Shadcn Toast hook
  const { toast } = useToast();

  useEffect(() => {
    AuthManager.initializeAdmins();
    DataManager.initializeData();
    setData(DataManager.getData());
  }, []);

  const refresh = useCallback(() => setData(DataManager.getData()), []);

  const handleLogin = (admin: Admin) => {
    setCurrentAdmin(admin);
    refresh();
    toast({
      title: "Welcome back!",
      description: `Successfully signed in as ${admin.fullName}`,
      variant: "success", // Using the custom variant created earlier
    });
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setCurrentPage("dashboard");
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });
  };

  // ---- Match handlers ----
  const handleAddMatch = (match: Omit<Match, "id" | "createdAt">) => {
    DataManager.add("matches", match);
    refresh();
    toast({
      title: "Success",
      description: "Match added to the schedule.",
      variant: "success",
    });
  };
  const handleDeleteMatch = (id: number) => {
    DataManager.delete("matches", id);
    refresh();
    toast({
      title: "Match Deleted",
      description: "The match has been removed.",
      variant: "destructive",
    });
  };

  // ---- Result handlers ----
  const handleRecordResult = (matchId: number, teamA: string, teamB: string, scoreA: number, scoreB: number, sport: string) => {
    const winner = scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : "Draw";
    DataManager.add("results", { matchId, teamA, teamB, scoreA, scoreB, winner, sport });
    refresh();
    toast({
      title: "Result Recorded",
      description: `Winner: ${winner}`,
      variant: "success",
    });
  };

  // ---- Stat handlers ----
  const handleAddStat = (stat: Omit<Stat, "id" | "createdAt">) => {
    DataManager.add("stats", stat);
    refresh();
    toast({ title: "Stat added!", variant: "success" });
  };
  const handleUpdateStat = (id: number, stat: Partial<Stat>) => {
    DataManager.update("stats", id, stat);
    refresh();
    toast({ title: "Stat updated!", variant: "success" });
  };
  const handleDeleteStat = (id: number) => {
    DataManager.delete("stats", id);
    refresh();
    toast({ title: "Stat removed.", variant: "destructive" });
  };
  const handleLoadDemoStats = () => {
    // Logic for demo stats
    const players = DataManager.get("players");
    const colleges = ["COS Scions", "SOM Tycoons", "CSS Stallions", "CCAD Phoenix"];
    players.slice(0, 6).forEach((p, i) => {
      DataManager.add("stats", {
        type: "Player",
        sport: p.sport || "Basketball Men",
        college: p.college || colleges[i % 4],
        playerId: p.id,
        statName: (p.sport || "").toLowerCase().includes("basket") ? "Points" : "Goals",
        statValue: Math.floor(Math.random() * 20) + 1,
      });
    });
    refresh();
    toast({ title: "Demo stats loaded!" });
  };

  // ---- Media handlers ----
  const handleUploadMedia = (item: Omit<MediaItem, "id" | "createdAt">) => {
    DataManager.add("media", item);
    refresh();
    toast({ title: "Media uploaded!", variant: "success" });
  };

  // ---- Player handlers ----
  const handleAddPlayer = (player: Omit<Player, "id" | "createdAt">) => {
    DataManager.add("players", player);
    refresh();
    toast({ title: "Player added.", variant: "success" });
  };
  const handleDeletePlayer = (id: number) => {
    DataManager.delete("players", id);
    refresh();
    toast({ title: "Player removed.", variant: "destructive" });
  };
  const handleDeleteAllPlayers = () => {
    const d = DataManager.getData();
    d.players = [];
    DataManager.saveData(d);
    refresh();
    toast({ title: "All players cleared.", variant: "destructive" });
  };
  const handleImportPlayers = (players: Omit<Player, "id" | "createdAt">[]) => {
    players.forEach((p) => DataManager.add("players", p));
    refresh();
    toast({ title: "Import complete!", variant: "success" });
  };

  // ---- Notification handlers ----
  const handleSendNotification = (notif: Omit<Notification, "id" | "createdAt">) => {
    DataManager.add("notifications", notif);
    refresh();
    toast({ title: "Notification Sent", variant: "success" });
  };

  if (!currentAdmin) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (!data) return null;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage matches={data.matches} results={data.results} players={data.players} teams={data.teams} />;
      case "matches":
        return <MatchesPage matches={data.matches} onAddMatch={handleAddMatch} onDeleteMatch={handleDeleteMatch} />;
      case "results":
        return <ResultsPage matches={data.matches} results={data.results} onRecordResult={handleRecordResult} />;
      case "stats":
        return <StatsPage stats={data.stats} players={data.players} onAddStat={handleAddStat} onUpdateStat={handleUpdateStat} onDeleteStat={handleDeleteStat} onLoadDemoStats={handleLoadDemoStats} />;
      case "media":
        return <MediaPage matches={data.matches} media={data.media} onUploadMedia={handleUploadMedia} />;
      case "teams":
        return <TeamsPage players={data.players} onAddPlayer={handleAddPlayer} onDeletePlayer={handleDeletePlayer} onDeleteAllPlayers={handleDeleteAllPlayers} onImportPlayers={handleImportPlayers} />;
      case "notifications":
        return <NotificationsPage notifications={data.notifications} onSend={handleSendNotification} />;
      case "archives":
        return <ArchivesPage results={data.results} media={data.media} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={() => setLogoutModal(true)} 
        adminName={currentAdmin.fullName} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={currentPage} adminName={currentAdmin.fullName} />
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderPage()}
        </div>
      </main>

      <Modal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to logout of IskoArena?"
        onConfirm={() => { setLogoutModal(false); handleLogout(); }}
        onCancel={() => setLogoutModal(false)}
      />

      {/* The Global Toaster - Handles all active toasts */}
      <Toaster />
    </div>
  );
}
