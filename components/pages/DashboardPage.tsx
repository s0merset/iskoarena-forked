"use client";

import React from "react";
import type { Match, Result, Player, Team } from "@/types";
import { 
  Trophy, 
  Zap, 
  Users, 
  User, 
  Calendar, 
  Clock,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  matches: Match[];
  results: Result[];
  players: Player[];
  teams: Team[];
}

export default function DashboardPage({ matches, results, players, teams }: DashboardPageProps) {
  const now = new Date();

  // Logic to determine ongoing matches
  const ongoingMatches = matches.filter((match) => {
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    const timeDiff = now.getTime() - matchDateTime.getTime();
    const hasResult = results.some((r) => r.matchId === match.id);
    // Ongoing if started within last 2 hours and no result reported yet
    return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000 && !hasResult;
  });

  const recentMatches = [...matches].slice(-4).reverse();

  const statCards = [
    { 
      label: "TOTAL MATCHES", 
      value: matches.length, 
      icon: Trophy, 
      color: "from-orange-500/20 to-orange-500/5", 
      iconColor: "text-orange-600",
      accent: "bg-orange-500",
      trend: "All seasons"
    },
    { 
      label: "LIVE NOW", 
      value: ongoingMatches.length, 
      icon: Zap, 
      color: "from-red-500/20 to-red-500/5", 
      iconColor: "text-red-600",
      accent: "bg-red-600",
      isLive: true,
      trend: "Ongoing matches"
    },
    { 
      label: "TOTAL TEAMS", 
      value: teams.length, 
      icon: Users, 
      color: "from-blue-500/20 to-blue-500/5", 
      iconColor: "text-blue-600",
      accent: "bg-blue-600",
      trend: "Active rosters"
    },
    { 
      label: "TOTAL PLAYERS", 
      value: players.length, 
      icon: User, 
      color: "from-emerald-500/20 to-emerald-500/5", 
      iconColor: "text-emerald-600",
      accent: "bg-emerald-600",
      trend: "Verified Iskos"
    },
  ];

  return (
    <div className="space-y-8 p-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      

      {/* Enhanced Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card 
            key={card.label} 
            className="group drop-shadow-2xl relative overflow-hidden border-none bg-white transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
          >
            {/* Top Accent Bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1 z-10 opacity-30 group-hover:opacity-100 transition-opacity", card.accent)} />
            
            <CardContent className="p-0">
              <div className="p-6 relative">
                {/* Decorative Background Blob */}
                <div className={cn(
                  "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-br", 
                  card.color
                )} />

                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        {card.label}
                      </p>
                      <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter group-hover:scale-105 transition-transform origin-left duration-300">
                        {card.value}
                      </h3>
                    </div>

                    {/* Trend / Status Line */}
                    <div className="flex items-center gap-1.5">
                      <div className={cn("p-1 rounded-full", card.isLive ? "bg-red-100" : "bg-slate-100")}>
                        {card.isLive ? (
                          <Activity className="w-3 h-3 text-red-600 animate-pulse" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 italic">
                        {card.trend}
                      </span>
                    </div>
                  </div>

                  {/* Glass Style Icon Box */}
                  <div className={cn(
                    "relative p-4 rounded-2xl transition-all duration-500 group-hover:rotate-[10deg] shadow-sm",
                    "bg-gradient-to-br border border-white/50",
                    card.color
                  )}>
                    <card.icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", card.iconColor)} />
                    
                    {/* Pulsing Live Indicator */}
                    {card.isLive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Matches Table Card */}
      <Card className="border-none drop-shadow-2xl bg-white overflow-hidden transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)]">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-7 border-b border-slate-50">
          <CardTitle className="text-xl font-black text-[#800000] tracking-tight">Recent Matches</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-[#800000] font-black hover:bg-red-50 group px-4">
            View Schedule <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/60">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Sport</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Team A</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">vs</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Team B</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Date & Time</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMatches.map((match) => {
                const hasResult = results.some((r) => r.matchId === match.id);
                const isLive = ongoingMatches.some((m) => m.id === match.id);

                return (
                  <TableRow key={match.id} className="group transition-colors border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="px-8 py-6 font-bold text-slate-900">{match.sport}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110" />
                        <span className="font-bold text-slate-700 text-sm">{match.teamA}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center italic text-slate-300 font-black group-hover:text-[#800000] transition-colors">VS</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110" />
                        <span className="font-bold text-slate-700 text-sm">{match.teamB}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 tracking-tight">{match.date}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{match.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "border-none shadow-sm px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 group-hover:scale-105",
                        isLive ? "bg-blue-500 text-white" : 
                        hasResult ? "bg-slate-800 text-white" : 
                        "bg-orange-400 text-white"
                      )}>
                        {isLive ? "Live" : hasResult ? "Finished" : "Upcoming"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="p-4 text-center bg-slate-50/30 border-t border-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
              Real-time update active • Data refreshed just now
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Briefing Banner Footer */}
      <Card className="border-none drop-shadow-2xl bg-white overflow-hidden group shadow-[0_20px_50px_-12px_rgba(128,0,0,0.12)] hover:shadow-[0_30px_60px_-12px_rgba(128,0,0,0.18)] transition-all duration-500">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-red-50 p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-3">
              <Calendar className="w-7 h-7 text-[#800000]" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg tracking-tight">Next Tournament Briefing</p>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> Tomorrow at 10:00 AM • Conference Hall B
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none bg-[#800000] hover:bg-[#600000] text-white px-10 h-12 rounded-xl font-black text-sm transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95">
              Attend Briefing
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-200 hover:bg-white hover:text-[#800000] hover:border-[#800000] transition-all shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
