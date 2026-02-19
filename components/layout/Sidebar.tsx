"use client";
import React from "react";
import type { PageName } from "@/types";

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
  adminName: string;
}

const navItems: { page: PageName; icon: string; label: string }[] = [
  { page: "dashboard", icon: "📊", label: "Dashboard" },
  { page: "matches", icon: "🏆", label: "Manage Matches" },
  { page: "results", icon: "📝", label: "Record Results" },
  { page: "stats", icon: "📈", label: "Stats" },
  { page: "media", icon: "📸", label: "Media Upload" },
  { page: "teams", icon: "👥", label: "Teams & Players" },
  { page: "notifications", icon: "🔔", label: "Notifications" },
  { page: "archives", icon: "📂", label: "Archives" },
];

export default function Sidebar({ currentPage, onNavigate, onLogout, adminName }: SidebarProps) {
  return (
    <aside className="w-[260px] bg-[#A91D3A] text-white flex flex-col p-5 overflow-y-auto shadow-md z-[100] shrink-0">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-xl font-semibold">IskoArena</h2>
      </div>

      <nav className="flex-1">
        {navItems.map(({ page, icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm font-medium transition-all border-2 cursor-pointer text-left ${
              currentPage === page
                ? "bg-[#FFD700] text-[#A91D3A] border-[#A91D3A]"
                : "text-white/80 border-transparent hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border-2 border-white/30 rounded-lg text-sm font-medium hover:bg-red-600 hover:border-red-600 transition-all mt-4"
      >
        <span>🚪</span> Logout
      </button>
    </aside>
  );
}
