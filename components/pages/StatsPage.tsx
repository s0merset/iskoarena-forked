"use client";
import React, { useState, useMemo } from "react";
import type { Stat, Player } from "@/types";
import { SPORTS, COLLEGES, DataManager, csvEscape, exportCSV } from "@/lib/dataManager";
import Modal from "@/components/ui/Modal";

interface StatsPageProps {
  stats: Stat[];
  players: Player[];
  onAddStat: (stat: Omit<Stat, "id" | "createdAt">) => void;
  onUpdateStat: (id: number, stat: Partial<Stat>) => void;
  onDeleteStat: (id: number) => void;
  onLoadDemoStats: () => void;
}

const statSports = [
  "Badminton","Basketball Men","Basketball Women","Cheerdance","Chess","Dancesports",
  "Esports - Mobile Legends: Bang Bang","Esports - DOTA 2","Esports - Valorant",
  "Frisbee","Soccer","Softball","Table Tennis","Volleyball Men","Volleyball Women","Petanque",
];

const emptyForm = { type: "" as "Player" | "Team" | "", sport: "", college: "", playerId: "", statName: "", statValue: "" };

export default function StatsPage({ stats, players, onAddStat, onUpdateStat, onDeleteStat, onLoadDemoStats }: StatsPageProps) {
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [search, setSearch] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterSport, setFilterSport] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  const filteredPlayers = useMemo(() =>
    players.filter((p) => (!form.college || p.college === form.college) && (!form.sport || p.sport === form.sport)),
    [players, form.college, form.sport]
  );

  const filteredStats = useMemo(() => {
    const q = search.toLowerCase();
    return stats
      .filter((s) => {
        const player = s.playerId ? players.find((p) => p.id === s.playerId) : null;
        return (
          (!q || s.statName.toLowerCase().includes(q) || (player?.name.toLowerCase().includes(q) ?? false) || s.college.toLowerCase().includes(q)) &&
          (!filterCollege || s.college === filterCollege) &&
          (!filterSport || s.sport === filterSport)
        );
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const va = (a as Record<string, unknown>)[sortKey] ?? "";
        const vb = (b as Record<string, unknown>)[sortKey] ?? "";
        if (sortKey === "createdAt") return (new Date(String(va)).getTime() - new Date(String(vb)).getTime()) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
  }, [stats, players, search, filterCollege, filterSport, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.sport || !form.college || !form.statName || !form.statValue) {
      alert("Please fill in all required stat fields"); return;
    }
    const stat = {
      type: form.type as "Player" | "Team",
      sport: form.sport,
      college: form.college,
      playerId: form.type === "Player" && form.playerId ? parseInt(form.playerId) : null,
      statName: form.statName,
      statValue: form.statValue,
    };
    if (editingId) { onUpdateStat(editingId, stat); setEditingId(null); }
    else onAddStat(stat);
    setForm({ ...emptyForm });
  };

  const handleEdit = (s: Stat) => {
    setEditingId(s.id);
    setForm({ type: s.type, sport: s.sport, college: s.college, playerId: s.playerId ? String(s.playerId) : "", statName: s.statName, statValue: String(s.statValue) });
  };

  const handleExport = () => {
    const headers = ["id","type","sport","college","playerId","statName","statValue","createdAt"];
    exportCSV(headers, stats.map((s) => headers.map((h) => csvEscape((s as Record<string,unknown>)[h]))), "stats.csv");
  };

  const thCls = (key: string) =>
    `px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide cursor-pointer select-none ${sortKey === key ? "opacity-100" : "opacity-70 hover:opacity-100"}`;

  return (
    <div>
      {/* Add Stat Form */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Add / Edit Stat</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelCls}>Type *</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "Player" | "Team" | "" })} required>
                <option value="">Select Type</option>
                <option value="Player">Player</option>
                <option value="Team">Team</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Sport *</label>
              <select className={inputCls} value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} required>
                <option value="">Select Sport</option>
                {statSports.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>College / Team *</label>
              <select className={inputCls} value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required>
                <option value="">Select College</option>
                {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {form.type === "Player" && (
              <div>
                <label className={labelCls}>Player *</label>
                <select className={inputCls} value={form.playerId} onChange={(e) => setForm({ ...form, playerId: e.target.value })}>
                  <option value="">Select Player</option>
                  {filteredPlayers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.jersey})</option>)}
                </select>
              </div>
            )}
            <div>
              <label className={labelCls}>Stat Name *</label>
              <input type="text" className={inputCls} placeholder="e.g., Points, Assists" value={form.statName} onChange={(e) => setForm({ ...form, statName: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Value *</label>
              <input type="text" className={inputCls} placeholder="e.g., 12" value={form.statValue} onChange={(e) => setForm({ ...form, statValue: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-[#A91D3A] hover:bg-[#8B1528] text-white rounded-md text-sm font-semibold transition-all">
              {editingId ? "Update Stat" : "Add Stat"}
            </button>
            <button type="button" onClick={onLoadDemoStats} className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-semibold transition-all">
              Load Demo Stats
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }} className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md text-sm font-semibold transition-all">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Stats Table */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-4">All Stats</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <input type="text" placeholder="Search stats..." className={`${inputCls} max-w-[220px]`} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={`${inputCls} max-w-[180px]`} value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)}>
            <option value="">All Colleges</option>
            {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={`${inputCls} max-w-[180px]`} value={filterSport} onChange={(e) => setFilterSport(e.target.value)}>
            <option value="">All Sports</option>
            {statSports.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleExport} className="ml-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-xs font-semibold transition-all">
            Export Stats CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {[["type","Type"],["sport","Sport"],["college","Team"],["player","Player"],["statName","Stat"],["statValue","Value"],["createdAt","Date"]].map(([k,l]) => (
                  <th key={k} className={thCls(k)} onClick={() => handleSort(k)}>
                    {l} {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-400 italic py-10">No stats match the filters.</td></tr>
              ) : (
                filteredStats.map((s) => {
                  const player = s.playerId ? players.find((p) => p.id === s.playerId) : null;
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-sm">{s.type}</td>
                      <td className="px-3 py-3 text-sm">{s.sport}</td>
                      <td className="px-3 py-3 text-sm">{s.college}</td>
                      <td className="px-3 py-3 text-sm">{player?.name || ""}</td>
                      <td className="px-3 py-3 text-sm">{s.statName}</td>
                      <td className="px-3 py-3 text-sm">{s.statValue}</td>
                      <td className="px-3 py-3 text-sm">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(s)} className="px-3 py-1 bg-[#A91D3A] hover:bg-[#8B1528] text-white rounded text-xs font-semibold">Edit</button>
                          <button onClick={() => setDeleteModal({ open: true, id: s.id })} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteModal.open}
        title="Delete Stat"
        message="Are you sure you want to delete this stat?"
        onConfirm={() => { if (deleteModal.id) onDeleteStat(deleteModal.id); setDeleteModal({ open: false, id: null }); }}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}
