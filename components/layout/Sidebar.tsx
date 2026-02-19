"use client";

import React from "react";
import type { PageName } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Trophy,
  FileText,
  BarChart3,
  Image,
  Users,
  Bell,
  Archive,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
  adminName: string;
}

const navItems: { page: PageName; icon: React.ElementType; label: string }[] = [
  { page: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { page: "matches", icon: Trophy, label: "Manage Matches" },
  { page: "results", icon: FileText, label: "Record Results" },
  { page: "stats", icon: BarChart3, label: "Stats" },
  { page: "media", icon: Image, label: "Media Upload" },
  { page: "teams", icon: Users, label: "Teams & Players" },
  //{ page: "notifications", icon: Bell, label: "Notifications" },
  { page: "archives", icon: Archive, label: "Archives" },
];

export default function Sidebar({ currentPage, onNavigate, onLogout, adminName }: SidebarProps) {
  return (
    <aside className="w-64 bg-maroon-primary border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <h2 className="text-xl font-bold tracking-tight text-white">
            <span className="text-gold-primary">Isko</span>Arena
          </h2>
        </div>
      </div>

      <div className="px-6">
        <Separator className="bg-white/10" />
      </div>

      {/* Navigation Links - Scrollable div with Tailwind arbitrary scrollbar styling */}
      <div className="flex-1 overflow-y-auto py-6 px-4 
        [&::-webkit-scrollbar]:w-1 
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-white/10 
        hover:[&::-webkit-scrollbar-thumb]:bg-gold-primary/20
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <nav className="space-y-1.5">
          {navItems.map(({ page, icon: Icon, label }) => {
            const isActive = currentPage === page;
            return (
              <Button
                key={page}
                variant="ghost"
                onClick={() => onNavigate(page)}
                className={cn(
                  "w-full justify-start gap-3.5 rounded-full  px-4 py-6 text-sm font-medium transition-all group relative overflow-hidden",
                  isActive
                    ? "bg-gold-primary text-maroon-primary hover:bg-gold-primary hover:text-maroon-primary " 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-maroon-primary" : "text-gold-primary group-hover:text-white"
                  )}
                />
		    <span className="relative z-10">{label}</span>
		</Button>
		);
		})}
	    </nav>
	  </div>

      {/* Profile & Logout Section */}
      <div className="p-4 bg-black/10 border-t border-white/5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">
                {adminName}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-white/40 font-medium">Online Now</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full justify-start text-white/50 rounded-full hover:bg-red-500/20 hover:text-red-400 group transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-semibold uppercase tracking-wider">Logout Session</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
