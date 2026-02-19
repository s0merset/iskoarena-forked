"use client";
import React, { useState } from "react";
import type { Notification } from "@/types";
import { SPORTS } from "@/lib/dataManager";

interface NotificationsPageProps {
  notifications: Notification[];
  onSend: (notif: Omit<Notification, "id" | "createdAt">) => void;
}

export default function NotificationsPage({ notifications, onSend }: NotificationsPageProps) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [sport, setSport] = useState("");

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#A91D3A] focus:ring-2 focus:ring-[#A91D3A]/10 bg-white text-black";
  const labelCls = "block text-sm font-medium text-black mb-2";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !type) { alert("Please fill in all required fields"); return; }
    onSend({ message, type, sport: sport || "All Sports", timestamp: new Date().toLocaleString() });
    setMessage("");
    setType("");
    setSport("");
  };

  const typeColor: Record<string, string> = {
    Urgent: "border-l-red-600",
    Sport: "border-l-yellow-500",
    default: "border-l-emerald-600",
  };

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Send Notification</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className={labelCls}>Message *</label>
            <textarea
              className={`${inputCls} resize-y min-h-[100px]`}
              placeholder="Notification message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelCls}>Type *</label>
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select Type</option>
                {["General", "Sport", "Match", "Result", "Urgent"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sport (Optional)</label>
              <select className={inputCls} value={sport} onChange={(e) => setSport(e.target.value)}>
                <option value="">All Sports</option>
                {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-[#A91D3A] hover:bg-[#8B1528] text-white rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5">
            Send Notification
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-[#A91D3A] text-lg font-semibold mb-5">Notifications Sent</h3>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 italic py-10">No notifications sent yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {[...notifications].reverse().map((n) => (
              <div
                key={n.id}
                className={`bg-white p-4 border border-gray-200 rounded-md border-l-4 ${typeColor[n.type] || typeColor.default}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-black text-sm">{n.type} — {n.sport}</h4>
                  <span className="text-xs text-gray-400">{n.timestamp}</span>
                </div>
                <p className="text-sm text-black">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
