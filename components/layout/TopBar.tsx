"use client";

import React from "react";
import type { PageName } from "@/types";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBarProps {
  currentPage: PageName;
  adminName: string;
}

const titleMap: Record<PageName, string> = {
  dashboard: "Dashboard Overview",
  matches: "Match Management",
  stats: "Analytics & Statistics",
  results: "Record Results",
  media: "Media Library",
  teams: "Teams & Players",
  notifications: "System Notifications",
  archives: "Data Archives",
};

export default function TopBar({ currentPage, adminName }: TopBarProps) {
  return (
    // Set delayDuration={0} for instant testing
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/40 px-8 py-4 flex justify-between items-center shadow-sm">
        
        <div className="flex flex-col">
          <h1 className="text-[#800000] text-2xl font-black tracking-tight">
            {titleMap[currentPage]}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
		Iskolaro Portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            
            {/* SEARCH TOOLTIP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white transition-all">
                  <Search className="w-4 h-4 text-slate-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Search Records</p>
              </TooltipContent>
            </Tooltip>

            {/* SETTINGS TOOLTIP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white transition-all">
                  <Settings className="w-4 h-4 text-slate-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>System Settings</p>
              </TooltipContent>
            </Tooltip>

            {/* NOTIFICATIONS TOOLTIP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white transition-all">
                    <Bell className="w-4 h-4 text-slate-500" />
                  </Button>
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Recent Alerts</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-sm font-black text-slate-900 leading-none">
                {adminName}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                Admin Officer
              </span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
              <AvatarFallback className="bg-[#f8d7da] text-[#800000] font-black text-xs">
                {adminName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
