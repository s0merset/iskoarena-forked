"use client";
import React, { useState } from "react";
import type { Match } from "@/types";
import { SPORTS, TEAMS } from "@/lib/dataManager";

interface MatchesPageProps {
  matches: Match[];
  onAddMatch: (match: Omit<Match, "id" | "createdAt">) => void;
  onDeleteMatch: (id: number) => void;
}

const emptyForm = { sport: "", teamA: "", teamB: "", date: "", time: "", venue: "" };

export default function MatchesPage({ matches, onAddMatch, onDeleteMatch }: MatchesPageProps) {
  const [form, setForm] = useState(emptyForm);
  const [modal, setModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.teamA === form.teamB) { alert("Team A and Team B cannot be the same"); return; }
    onAddMatch({ ...form, status: "upcoming" });
    setForm(emptyForm);
  };

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  return (
    <div>
      {/* Add Match Form */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Add New Match</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelCls}>Sport *</label>
              <select className={inputCls} value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} required>
                <option value="">Select Sport</option>
                {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Team A *</label>
              <select className={inputCls} value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} required>
                <option value="">Select Team A</option>
                {TEAMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Team B *</label>
              <select className={inputCls} value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} required>
                <option value="">Select Team B</option>
                {TEAMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Time *</label>
              <input type="time" className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Venue *</label>
              <input type="text" className={inputCls} placeholder="Location" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-[#A91D3A] hover:bg-[#8B1528] text-white rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5">
            Add Match
          </button>
        </form>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">All Matches</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {["Sport", "Team A", "Team B", "Date", "Time", "Venue", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-400 italic py-10">No matches yet.</td></tr>
              ) : (
                matches.map((match) => {
                  const matchDT = new Date(`${match.date}T${match.time}`);
                  const upcoming = matchDT > new Date();
                  return (
                    <tr key={match.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-sm">{match.sport}</td>
                      <td className="px-3 py-3 text-sm">{match.teamA}</td>
                      <td className="px-3 py-3 text-sm">{match.teamB}</td>
                      <td className="px-3 py-3 text-sm">{match.date}</td>
                      <td className="px-3 py-3 text-sm">{match.time}</td>
                      <td className="px-3 py-3 text-sm">{match.venue}</td>
                      <td className="px-3 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${upcoming ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-emerald-700"}`}>
                          {upcoming ? "Upcoming" : "Completed"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setModal({ open: true, id: match.id })}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-all"
                        >
                          Delete
                        </button>
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
