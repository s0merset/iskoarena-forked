"use client";

import React from "react";
import { 
  Trophy, 
  Zap, 
  Users, 
  User, 
  Calendar, 
  Clock,
  ChevronRight,
  ArrowRight,
  Activity
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * TypeScript Interfaces for IskoArena Data Models
 */
export interface Match {
  id: string;
  sport: string;
  teamA: string;
  teamB: string;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // 24h format: HH:mm
}

export interface Result {
  matchId: string;
  scoreA: number;
  scoreB: number;
  winnerId: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  org: string;
}

interface DashboardPageProps {
  matches: Match[];
  results: Result[];
  players: Player[];
  teams: Team[];
}

/**
 * IskoArena Dashboard
 * Design: Vercel/Geist Minimalist
 */
export default function DashboardPage({ 
  matches, 
  results, 
  players, 
  teams 
}: DashboardPageProps) {
  const now = new Date();

  // Logic: Matches happening within a 2-hour window from their start time
  const ongoingMatches = matches.filter((match) => {
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    const timeDiff = now.getTime() - matchDateTime.getTime();
    const hasResult = results.some((r) => r.matchId === match.id);
    return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000 && !hasResult;
  });

  const recentMatches = [...matches].slice(-5).reverse();

  const statCards = [
    { 
      label: "Total Matches", 
      value: matches.length, 
      icon: Trophy, 
      trend: "Across all sports" 
    },
    { 
      label: "Live Now", 
      value: ongoingMatches.length, 
      icon: Zap, 
      isLive: true, 
      trend: "Ongoing matches" 
    },
    { 
      label: "Total Teams", 
      value: teams.length, 
      icon: Users, 
      trend: "Participating Orgs" 
    },
    { 
      label: "Total Players", 
      value: players.length, 
      icon: User, 
      trend: "Verified Iskolaros" 
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* Vercel-Style Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="shadow-sm border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tighter">
                    {card.value}
                  </p>
                </div>
                <div className={cn(
                  "p-2.5 rounded-lg border border-border bg-muted/30 text-muted-foreground",
                  card.isLive && "bg-red-50 border-red-100 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                )}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-medium text-muted-foreground">
                {card.isLive ? (
                  <>
                    <span className="mr-2 flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-red-600 uppercase">Live Updates Active</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 opacity-70">
                    <Activity className="w-3 h-3" /> {card.trend}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area: Recent Matches */}
      <Card className="shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight">Recent Matches</CardTitle>
            <CardDescription className="text-sm">
              The latest score updates and upcoming schedules from UP Cebu Intramurals.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium transition-colors hover:bg-muted">
            View Schedule <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="h-11 font-medium text-muted-foreground pl-6">Sport</TableHead>
                <TableHead className="h-11 font-medium text-muted-foreground">Matchup</TableHead>
                <TableHead className="h-11 font-medium text-muted-foreground">Schedule</TableHead>
                <TableHead className="h-11 text-right font-medium text-muted-foreground pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMatches.map((match) => {
                const hasResult = results.some((r) => r.matchId === match.id);
                const isLive = ongoingMatches.some((m) => m.id === match.id);

                return (
                  <TableRow key={match.id} className="group cursor-default border-b last:border-0 hover:bg-muted/20">
                    <TableCell className="pl-6 font-semibold text-foreground uppercase text-[12px] tracking-tight">
                      {match.sport}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{match.teamA}</span>
                        <span className="text-[10px] text-muted-foreground font-bold italic">VS</span>
                        <span className="font-medium">{match.teamB}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col py-1">
                        <span className="text-sm font-medium">{match.date}</span>
                        <span className="text-[11px] text-muted-foreground">{match.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge 
                        variant={isLive ? "default" : hasResult ? "secondary" : "outline"} 
                        className={cn(
                          "rounded-full font-semibold text-[10px] uppercase tracking-widest px-3 py-0.5",
                          isLive && "bg-red-600 hover:bg-red-700 text-white border-transparent"
                        )}
                      >
                        {isLive ? "Live" : hasResult ? "Finished" : "Upcoming"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dark Banner: Next Event Call-to-Action */}
      <Card className="shadow-lg border-none bg-zinc-950 text-white overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 to-transparent pointer-events-none" />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 shadow-inner group-hover:bg-zinc-800 transition-colors">
              <Calendar className="w-8 h-8 text-zinc-300" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg tracking-tight">Next Tournament Briefing</p>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Tomorrow, 10:00 AM
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>Conference Hall B</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button className="flex-1 md:flex-none bg-white text-black hover:bg-zinc-200 h-10 px-8 rounded-md font-semibold text-sm transition-all active:scale-95 shadow-xl shadow-white/5">
              Attend Briefing
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-zinc-800 h-10 w-10 border border-zinc-800">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
