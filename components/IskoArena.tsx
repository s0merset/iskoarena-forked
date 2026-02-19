"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AuthManager, DataManager } from "@/lib/dataManager";
import type { Admin, AppData, Match, Result, Player, Stat, MediaItem, Notification, PageName } from "@/types";

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
import Toast from "@/components/ui/Toast";

export default function IskoArena() {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");
  const [data, setData] = useState<AppData | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    AuthManager.initializeAdmins();
    DataManager.initializeData();
    setData(DataManager.getData());
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const refresh = useCallback(() => setData(DataManager.getData()), []);

  const handleLogin = (admin: Admin) => {
    setCurrentAdmin(admin);
    refresh();
    showToast(`Welcome back, ${admin.fullName}!`);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setCurrentPage("dashboard");
    showToast("You have been logged out.");
  };

  // ---- Match handlers ----
  const handleAddMatch = (match: Omit<Match, "id" | "createdAt">) => {
    DataManager.add("matches", match);
    refresh();
    showToast("Match added successfully!");
  };
  const handleDeleteMatch = (id: number) => {
    DataManager.delete("matches", id);
    refresh();
    showToast("Match deleted.");
  };

  // ---- Result handlers ----
  const handleRecordResult = (matchId: number, teamA: string, teamB: string, scoreA: number, scoreB: number, sport: string) => {
    const winner = scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : "Draw";
    DataManager.add("results", { matchId, teamA, teamB, scoreA, scoreB, winner, sport });
    refresh();
    showToast("Result recorded successfully!");
  };

  // ---- Stat handlers ----
  const handleAddStat = (stat: Omit<Stat, "id" | "createdAt">) => {
    DataManager.add("stats", stat);
    refresh();
    showToast("Stat added!");
  };
  const handleUpdateStat = (id: number, stat: Partial<Stat>) => {
    DataManager.update("stats", id, stat);
    refresh();
    showToast("Stat updated!");
  };
  const handleDeleteStat = (id: number) => {
    DataManager.delete("stats", id);
    refresh();
    showToast("Stat deleted.");
  };
  const handleLoadDemoStats = () => {
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
    colleges.forEach((col) => {
      DataManager.add("stats", { type: "Team", sport: "Basketball Men", college: col, playerId: null, statName: "Wins", statValue: Math.floor(Math.random() * 10) });
    });
    refresh();
    showToast("Demo stats loaded!");
  };

  // ---- Media handlers ----
  const handleUploadMedia = (item: Omit<MediaItem, "id" | "createdAt">) => {
    DataManager.add("media", item);
    refresh();
    showToast("Media uploaded successfully!");
  };

  // ---- Player handlers ----
  const handleAddPlayer = (player: Omit<Player, "id" | "createdAt">) => {
    DataManager.add("players", player);
    refresh();
    showToast("Player added successfully!");
  };
  const handleDeletePlayer = (id: number) => {
    DataManager.delete("players", id);
    refresh();
    showToast("Player deleted.");
  };
  const handleDeleteAllPlayers = () => {
    const d = DataManager.getData();
    d.players = [];
    DataManager.saveData(d);
    refresh();
    showToast("All players removed.");
  };
  const handleImportPlayers = (players: Omit<Player, "id" | "createdAt">[]) => {
    players.forEach((p) => DataManager.add("players", p));
    refresh();
    showToast("Players imported!");
  };

  // ---- Notification handlers ----
  const handleSendNotification = (notif: Omit<Notification, "id" | "createdAt">) => {
    DataManager.add("notifications", notif);
    refresh();
    showToast("Notification sent!");
  };

  if (!currentAdmin) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={() => setLogoutModal(true)} adminName={currentAdmin.fullName} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={currentPage} adminName={currentAdmin.fullName} />
        <div className="flex-1 overflow-y-auto p-8">
          {renderPage()}
        </div>
      </main>

      <Modal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={() => { setLogoutModal(false); handleLogout(); }}
        onCancel={() => setLogoutModal(false)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
