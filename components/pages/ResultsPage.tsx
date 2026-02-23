"use client";
import React, { useState } from "react";
import type { Match, Result } from "@/types";

interface ResultsPageProps {
  matches: Match[];
  results: Result[];
  onRecordResult: (matchId: string, teamA: string, teamB: string, scoreA: number, scoreB: number, sport: string) => void;
}

export default function ResultsPage({ matches, results, onRecordResult }: ResultsPageProps) {
  const [selectedMatch, setSelectedMatch] = useState("");
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) { alert("Please select a match"); return; }

    const [matchId, teamA, teamB] = selectedMatch.split("|");
    const a = parseInt(scoreA);
    const b = parseInt(scoreB);
    if (isNaN(a) || isNaN(b)) { alert("Please enter valid scores"); return; }

    const match = matches.find((m) => m.id === matchId);
    if (!match) { alert("Match not found"); return; }

    onRecordResult(matchId, teamA, teamB, a, b, match.sport);

    // clear the form
    setSelectedMatch("");
    setScoreA("");
    setScoreB("");
  };

  const showScores = selectedMatch !== "";

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Select Match & Record Result</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelCls}>Select Match *</label>
              <select className={inputCls} value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} required>
                <option value="">Choose a match</option>
                {matches.map((m) => (
                  <option key={m.id} value={`${m.id}|${m.teamA}|${m.teamB}`}>
                    {m.sport} - {m.teamA} vs {m.teamB} ({m.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showScores && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelCls}>Team A Score *</label>
                <input type="number" min="0" className={inputCls} placeholder="0" value={scoreA} onChange={(e) => setScoreA(e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Team B Score *</label>
                <input type="number" min="0" className={inputCls} placeholder="0" value={scoreB} onChange={(e) => setScoreB(e.target.value)} required />
              </div>
            </div>
          )}

          {showScores && (
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5">
              Save Result
            </button>
          )}
        </form>
      </div>

      {/* Results History */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Results History</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {["Sport", "Team A", "Score A", "Score B", "Team B", "Date", "Winner"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 italic py-10">No results recorded yet.</td></tr>
              ) : (
                results.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-sm">{r.sport}</td>
                    <td className="px-3 py-3 text-sm">{r.teamA}</td>
                    <td className="px-3 py-3 text-sm font-bold">{r.scoreA}</td>
                    <td className="px-3 py-3 text-sm font-bold">{r.scoreB}</td>
                    <td className="px-3 py-3 text-sm">{r.teamB}</td>
                    <td className="px-3 py-3 text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${r.winner === "Draw" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-emerald-700"}`}>
                        {r.winner}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
