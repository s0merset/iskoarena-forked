"use client";
import React from "react";
import type { Match, Result, Player, Team } from "@/types";

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
  }).length;

  const recentMatches = [...matches].slice(-5).reverse();

  const statCards = [
    { icon: "🏆", label: "Total Matches", value: matches.length },
    { icon: "⚡", label: "Ongoing Matches", value: ongoingMatches },
    { icon: "👥", label: "Total Teams", value: teams.length },
    { icon: "👤", label: "Total Players", value: players.length },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-gradient-to-br from-[#E8CDD1] to-[#FFF4D6] rounded-xl p-5 flex items-center gap-5 shadow-md border border-gray-200"
          >
            <span className="text-4xl">{card.icon}</span>
            <div>
              <p className="text-sm text-black font-medium">{card.label}</p>
              <p className="text-4xl font-bold text-[#A91D3A]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Matches */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h2 className="text-[#A91D3A] text-lg font-semibold mb-5">Recent Matches</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-3">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {["Sport", "Team A", "Team B", "Date", "Time", "Status"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentMatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 italic py-10">
                    No matches yet. Create your first match!
                  </td>
                </tr>
              ) : (
                recentMatches.map((match) => {
                  const hasResult = results.some((r) => r.matchId === match.id);
                  return (
                    <tr key={match.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-sm">{match.sport}</td>
                      <td className="px-3 py-3 text-sm">{match.teamA}</td>
                      <td className="px-3 py-3 text-sm">{match.teamB}</td>
                      <td className="px-3 py-3 text-sm">{match.date}</td>
                      <td className="px-3 py-3 text-sm">{match.time}</td>
                      <td className="px-3 py-3 text-sm">
                        {hasResult ? (
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-emerald-700">
                            Completed
                          </span>
                        ) : (
                          <span className="text-sm">Upcoming</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
