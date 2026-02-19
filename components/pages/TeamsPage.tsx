"use client";
import React, { useState, useMemo, useRef, useCallback } from "react";
import type { Player } from "@/types";
import { SPORTS, COLLEGES, POSITIONS_BY_SPORT, resizeImageFile, exportCSV, csvEscape } from "@/lib/dataManager";
import Modal from "@/components/ui/Modal";

interface TeamsPageProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, "id" | "createdAt">) => void;
  onDeletePlayer: (id: number) => void;
  onDeleteAllPlayers: () => void;
  onImportPlayers: (players: Omit<Player, "id" | "createdAt">[]) => void;
}

const emptyForm = { name: "", college: "", sport: "", position: "", jersey: "", photoDataUrl: "" };

export default function TeamsPage({ players, onAddPlayer, onDeletePlayer, onDeleteAllPlayers, onImportPlayers }: TeamsPageProps) {
  const [form, setForm] = useState({ ...emptyForm });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterSport, setFilterSport] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; all: boolean }>({ open: false, id: null, all: false });
  const [dragging, setDragging] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  const positions = useMemo(() => {
    if (!form.sport) return [];
    return POSITIONS_BY_SPORT[form.sport] || POSITIONS_BY_SPORT[form.sport.split(" ")[0]] || ["Player", "Other"];
  }, [form.sport]);

  const filteredSorted = useMemo(() => {
    const q = search.toLowerCase();
    return players
      .filter((p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!filterCollege || p.college === filterCollege) &&
        (!filterSport || p.sport === filterSport)
      )
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const getVal = (obj: Player): string | number => {
          switch (sortKey) {
            case "name": return obj.name;
            case "college": return obj.college;
            case "sport": return obj.sport;
            case "jersey": return obj.jersey;
            case "position": return obj.position;
            default: return "";
          }
        };
        const va = getVal(a);
        const vb = getVal(b);
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
  }, [players, search, filterCollege, filterSport, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / perPage));
  const pageItems = filteredSorted.slice((page - 1) * perPage, page * perPage);

  const handlePhotoFile = useCallback((file: File) => {
    resizeImageFile(file, 600, (dataUrl) => {
      setPhotoPreview(dataUrl);
      setForm((f) => ({ ...f, photoDataUrl: dataUrl }));
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const jerseyNum = parseInt(form.jersey, 10);
    if (!form.name || !form.college || !form.sport || !form.position || form.jersey === "") {
      setFormError("All required fields must be filled."); return;
    }
    if (isNaN(jerseyNum) || jerseyNum < 0) { setFormError("Enter a valid jersey number."); return; }
    const dup = players.find((p) => p.college === form.college && p.sport === form.sport && p.jersey === jerseyNum);
    if (dup) { setFormError(`Jersey ${jerseyNum} is already taken by ${dup.name} (${dup.college} - ${dup.sport}).`); return; }
    onAddPlayer({ name: form.name, college: form.college, sport: form.sport, position: form.position, jersey: jerseyNum, photo: form.photoDataUrl || null });
    setForm({ ...emptyForm });
    setPhotoPreview(null);
    if (photoRef.current) photoRef.current.value = "";
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target!.result as string;
      const rows = text.split(/\r?\n/).filter(Boolean);
      const headers = rows.shift()!.split(",");
      const imported = rows.map((r) => {
        const cols = r.split(",");
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h.trim()] = cols[i]?.replace(/^"|"$/g, "") || ""; });
        return { name: obj.name || "", college: obj.college || "", sport: obj.sport || "", position: obj.position || "", jersey: parseInt(obj.jersey) || 0, photo: null };
      }).filter((p) => p.name);
      onImportPlayers(imported);
    };
    reader.readAsText(file);
    if (importRef.current) importRef.current.value = "";
  };

  const handleExport = () => {
    const headers = ["id","name","college","sport","position","jersey","createdAt"];
    exportCSV(
      headers,
      players.map((p) =>
        headers.map((h) => {
          const row: Record<string, unknown> = {
            id: p.id, name: p.name, college: p.college,
            sport: p.sport, position: p.position, jersey: p.jersey, createdAt: p.createdAt,
          };
          return csvEscape(row[h]);
        })
      ),
      "players.csv"
    );
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const thCls = (key: string) =>
    `px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide cursor-pointer select-none`;

  return (
    <div>
      {/* Add Player Form */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Add New Player</h3>
        {formError && <div className="mb-4 text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-md">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelCls}>Player Name *</label>
              <input type="text" className={inputCls} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>College *</label>
              <select className={inputCls} value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required>
                <option value="">Select College</option>
                {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sport *</label>
              <select className={inputCls} value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value, position: "" })} required>
                <option value="">Select Sport</option>
                {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className={labelCls}>Position *</label>
              <select className={inputCls} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required>
                <option value="">Select Position</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Jersey Number *</label>
              <input type="number" min="0" className={inputCls} placeholder="e.g., 7" value={form.jersey} onChange={(e) => setForm({ ...form, jersey: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Player Photo (optional)</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-3 flex items-center gap-3 bg-white cursor-pointer transition-colors ${dragging ? "border-[#A91D3A] bg-[#E8CDD1]/20" : "border-gray-200"}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handlePhotoFile(f); }}
                onClick={() => photoRef.current?.click()}
              >
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
                <span className="text-sm text-gray-400 pointer-events-none">Drag & drop or click to select</span>
              </div>
              {photoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={photoPreview} alt="Preview" className="w-[80px] h-[80px] rounded-lg object-cover" />
                  <button type="button" className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-xs" onClick={() => { setPhotoPreview(null); setForm((f) => ({ ...f, photoDataUrl: "" })); if (photoRef.current) photoRef.current.value = ""; }}>Remove</button>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-[#A91D3A] hover:bg-[#8B1528] text-white rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5">
            Add Player
          </button>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-4">Search Players</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" className={inputCls} placeholder="Search players by name..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <div>
            <label className={labelCls}>College</label>
            <select className={inputCls} value={filterCollege} onChange={(e) => { setFilterCollege(e.target.value); setPage(1); }}>
              <option value="">All Colleges</option>
              {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sport</label>
            <select className={inputCls} value={filterSport} onChange={(e) => { setFilterSport(e.target.value); setPage(1); }}>
              <option value="">All Sports</option>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <button onClick={() => setDeleteModal({ open: true, id: null, all: true })} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-all">
              Remove All Players
            </button>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-4">Teams & Players</h3>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-3 items-center">
            <button onClick={handleExport} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-xs font-semibold transition-all">Export Players CSV</button>
            <input ref={importRef} type="file" accept="text/csv" className="text-xs text-gray-600" onChange={handleImport} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select className="px-2 py-1 border border-gray-200 rounded text-sm bg-white text-black" value={perPage} onChange={(e) => { setPerPage(parseInt(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E8CDD1]">
                {[["name","Player Name"],["college","Team"],["sport","Sport"],["jersey","Jersey"],["position","Position"]].map(([k,l]) => (
                  <th key={k} className={thCls(k)} onClick={() => handleSort(k)}>
                    {l} {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-[#A91D3A] font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 italic py-10">No players yet.</td></tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-sm flex items-center gap-2">
                      {p.photo ? <img src={p.photo} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0" /> : null}
                      {p.name}
                    </td>
                    <td className="px-3 py-3 text-sm">{p.college || "Unassigned"}</td>
                    <td className="px-3 py-3 text-sm">{p.sport || ""}</td>
                    <td className="px-3 py-3 text-sm">{p.jersey != null ? p.jersey : ""}</td>
                    <td className="px-3 py-3 text-sm">{p.position}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => setDeleteModal({ open: true, id: p.id, all: false })} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-gray-500">Page {page} of {totalPages}</div>
        {totalPages > 1 && (
          <div className="flex gap-2 mt-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 rounded text-xs">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 rounded text-xs">Next</button>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.open}
        title={deleteModal.all ? "Remove All Players" : "Delete Player"}
        message={deleteModal.all ? "Are you sure you want to remove ALL players? This cannot be undone." : "Are you sure you want to delete this player?"}
        onConfirm={() => {
          if (deleteModal.all) onDeleteAllPlayers();
          else if (deleteModal.id) onDeletePlayer(deleteModal.id);
          setDeleteModal({ open: false, id: null, all: false });
        }}
        onCancel={() => setDeleteModal({ open: false, id: null, all: false })}
      />
    </div>
  );
}

