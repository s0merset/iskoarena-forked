"use client";
import React from "react";
import type { PageName } from "@/types";

interface TopBarProps {
  currentPage: PageName;
  adminName: string;
}

const titleMap: Record<PageName, string> = {
  dashboard: "Dashboard",
  matches: "Manage Matches",
  stats: "Stats",
  results: "Record Results",
  media: "Media Upload",
  teams: "Teams & Players",
  notifications: "Notifications",
  archives: "Archives",
};

export default function TopBar({ currentPage, adminName }: TopBarProps) {
  return (
    <header className="bg-white px-8 py-5 border-b border-gray-200 flex justify-between items-center shadow-sm z-50">
      <h1 className="text-[#A91D3A] text-2xl font-semibold m-0">
        {titleMap[currentPage]}
      </h1>
      <div className="flex items-center gap-3 text-gray-500">
        <span className="text-sm">{adminName}</span>
        <div className="w-10 h-10 bg-[#E8CDD1] rounded-full flex items-center justify-center text-xl">
          👤
        </div>
      </div>
    </header>
  );
}
