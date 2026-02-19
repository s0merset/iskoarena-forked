"use client";
import React, { useState, useMemo } from "react";
import type { Result, MediaItem } from "@/types";

interface ArchivesPageProps {
  results: Result[];
  media: MediaItem[];
}

const ARCHIVE_SPORTS = ["Basketball", "Volleyball", "Football", "Badminton", "Tennis", "Chess", "Esports"];

export default function ArchivesPage({ results, media }: ArchivesPageProps) {
  const [year, setYear] = useState("");
  const [sport, setSport] = useState("");

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  const filteredMedia = useMemo(() => {
    return media.filter((m) => {
      const mediaYear = new Date(m.createdAt).getFullYear().toString();
      return (!year || mediaYear === year) && (!sport || m.sport === sport);
    });
  }, [media, year, sport]);

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-md border drop-shadow-2xl border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Filter Archives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Year</label>
            <select className={inputCls} value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Sport (Optional)</label>
            <select className={inputCls} value={sport} onChange={(e) => setSport(e.target.value)}>
              <option value="">All Sports</option>
              {ARCHIVE_SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Archived Results */}
      <div className="bg-white rounded-xl drop-shadow-2xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Archived Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {["Sport", "Team A", "Team B", "Score", "Date"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 italic py-10">No archived matches found.</td></tr>
              ) : (
                results
                  .filter((r) => {
                    const rYear = new Date(r.createdAt).getFullYear().toString();
                    return (!year || rYear === year) && (!sport || r.sport.toLowerCase().includes(sport.toLowerCase()));
                  })
                  .map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-sm">{r.sport}</td>
                      <td className="px-3 py-3 text-sm">{r.teamA}</td>
                      <td className="px-3 py-3 text-sm">{r.teamB}</td>
                      <td className="px-3 py-3 text-sm font-bold">{r.scoreA} – {r.scoreB} ({r.winner})</td>
                      <td className="px-3 py-3 text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archived Media */}
      <div className="bg-white rounded-xl drop-shadow-2xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Archived Media</h3>
        {filteredMedia.length === 0 ? (
          <p className="text-center text-gray-400 italic py-10">No archived media found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredMedia.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-full h-[120px] bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                  {item.type === "image" ? <img src={item.data} alt={item.title} className="w-full h-full object-cover" /> : "🎥"}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-black truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.type} • {item.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
