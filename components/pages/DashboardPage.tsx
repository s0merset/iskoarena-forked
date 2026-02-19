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
  ArrowRight
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

  const ongoingMatches = matches.filter((match) => {
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    const timeDiff = now.getTime() - matchDateTime.getTime();
    const hasResult = results.some((r) => r.matchId === match.id);
    return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000 && !hasResult;
  });

  const recentMatches = [...matches].slice(-4).reverse();

  const statCards = [
    { label: "TOTAL", title: "Total Matches", value: matches.length, icon: Trophy, color: "bg-orange-100 text-orange-600", status: null },
    { label: "LIVE", title: "Ongoing Matches", value: ongoingMatches.length, icon: Zap, color: "bg-red-100 text-red-600", status: "• LIVE" },
    { label: "ACTIVE", title: "Total Teams", value: teams.length, icon: Users, color: "bg-blue-100 text-blue-600", status: null },
    { label: "REGISTERED", title: "Total Players", value: players.length, icon: User, color: "bg-emerald-100 text-emerald-600", status: null },
  ];

  return (
    <div className="space-y-8 p-4 pb-12">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-[#800000] tracking-tight drop-shadow-sm">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-[#f8d7da] text-[#800000] font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card 
            key={card.title} 
            className="group border-none bg-white transition-all duration-300 hover:-translate-y-2 drop-shadow-2xl 
                       shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] 
                       hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-6px_rgba(0,0,0,0.1)]"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm", card.color)}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  {card.status && (
                    <span className="text-[10px] font-black text-red-500 animate-pulse mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {card.status}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    {card.label}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-slate-500 font-semibold">{card.title}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-[#800000] transition-colors">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Matches Table */}
      <Card className="border-none bg-white overflow-hidden transition-all duration-500 
                       shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] drop-shadow-2xl 
                       hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)]">
        <CardHeader className="flex flex-row items-center justify-between px-8 py-7 border-b border-slate-50">
          <CardTitle className="text-xl font-black text-[#800000] tracking-tight">Recent Matches</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-[#800000] font-black hover:bg-red-50 hover:text-[#a00000] group">
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
                    <TableCell className="px-8 py-5 font-bold text-slate-900">{match.sport}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm transition-transform group-hover:scale-110" />
                        <span className="font-bold text-slate-700 text-sm">{match.teamA}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center italic text-slate-300 font-black group-hover:text-[#800000] transition-colors">VS</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm transition-transform group-hover:scale-110" />
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
                        "border-none shadow-sm px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 group-hover:scale-105",
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
          <div className="p-4 text-center bg-slate-50/20">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
              Data synchronized • Just now
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Briefing Banner Footer */}
      <Card className="border-none bg-white overflow-hidden group drop-shadow-2xl 
                       shadow-[0_20px_50px_-12px_rgba(128,0,0,0.12)] 
                       hover:shadow-[0_30px_60px_-12px_rgba(128,0,0,0.18)] 
                       transition-all duration-500">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-red-50 p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-3">
              <Calendar className="w-7 h-7 text-[#800000]" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg tracking-tight">Next Tournament Briefing</p>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Tomorrow at 10:00 AM • Conference Hall B
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
