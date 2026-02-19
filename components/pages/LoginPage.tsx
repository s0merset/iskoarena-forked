"use client";
import React, { useState } from "react";
import { AuthManager } from "@/lib/dataManager";
import type { Admin } from "@/types";

interface LoginPageProps {
  onLogin: (admin: Admin) => void;
}

const newsItems = [
  {
    date: "Feb 20, 2026",
    title: "Basketball Tournament 2026",
    body: "Join the most exciting basketball tournament of the year! COS Scions, SOM Tycoons, CSS Stallions, and CCAD Phoenix compete for glory.",
    bg: "#A91D3A",
    color: "white",
  },
  {
    date: "Feb 18, 2026",
    title: "Women's Volleyball Finals",
    body: "The CSS Stallions take on CCAD Phoenix in an intense match. Watch the live coverage and see who claims the championship title!",
    bg: "#FFD700",
    color: "#A91D3A",
  },
  {
    date: "Feb 16, 2026",
    title: "Mobile Legends: Bang Bang Finals",
    body: "Experience the ultimate gaming competition! Teams compete in intense matches across multiple esports titles. Checkout our live streaming.",
    bg: "#8B1528",
    color: "white",
  },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showSignup, setShowSignup] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullName: "", username: "", password: "", confirmPassword: "" });
  const [signupMsg, setSignupMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const inputCls =
    "w-full px-4 py-3 border border-yellow-400/30 rounded-lg bg-white/5 text-white text-sm placeholder-white/50 focus:outline-none focus:bg-white/10 focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,215,0,0.3)] transition-all";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = AuthManager.verifyLogin(loginForm.username, loginForm.password);
    if (admin) { onLogin(admin); }
    else { alert("Invalid username or password"); }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMsg(null);
    const { fullName, username, password, confirmPassword } = signupForm;
    if (!fullName || !username || !password || !confirmPassword) { setSignupMsg({ text: "Please fill in all fields", ok: false }); return; }
    if (password.length < 6) { setSignupMsg({ text: "Password must be at least 6 characters", ok: false }); return; }
    if (password !== confirmPassword) { setSignupMsg({ text: "Passwords do not match", ok: false }); return; }
    if (username.length < 3) { setSignupMsg({ text: "Username must be at least 3 characters", ok: false }); return; }
    const result = AuthManager.registerAdmin(fullName, username, password);
    setSignupMsg({ text: result.message, ok: result.success });
    if (result.success) {
      setSignupForm({ fullName: "", username: "", password: "", confirmPassword: "" });
      setTimeout(() => setShowSignup(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, rgba(169,29,58,0.95) 0%, rgba(139,21,40,0.95) 60%)", color: "#fff" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] flex justify-between items-center px-8 py-4 border-b border-yellow-400/10 shadow-[0_6px_30px_rgba(0,0,0,0.35)]"
        style={{ background: "linear-gradient(90deg, #8B1528, #A91D3A)" }}
      >
        <div className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-11 h-11 rounded-lg bg-yellow-400/20 flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(255,215,0,0.3)]">🏆</div>
          <span className="text-2xl font-bold text-yellow-400 tracking-wide">IskoArena</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSignup(false)}
            className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 rounded-md text-sm font-semibold transition-all hover:bg-yellow-400 hover:text-[#A91D3A] hover:-translate-y-0.5"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignup(true)}
            className="px-6 py-2 bg-yellow-400 text-[#A91D3A] rounded-md text-sm font-semibold transition-all hover:bg-yellow-300 hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 pt-6 pb-8 max-w-[1400px] mx-auto w-full mt-20">
        {/* News */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">IskoArena News</h2>
          <div className="flex flex-col gap-6">
            {newsItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl overflow-hidden border border-yellow-400/20 bg-white/5 backdrop-blur-sm cursor-pointer transition-all hover:-translate-y-1 hover:border-yellow-400 hover:shadow-[0_18px_40px_rgba(169,29,58,0.35)]"
              >
                <div
                  className="w-full h-[160px] flex items-center justify-center text-2xl font-bold"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.title}
                </div>
                <div className="p-5">
                  <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">{item.date}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{item.body}</p>
                  <a href="#" className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 hover:translate-x-1 transition-all inline-block">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Forms */}
        <div className="flex items-start justify-center pt-2">
          <div className="w-full max-w-[450px]">
            {/* Auth Card */}
            <div className="rounded-2xl p-10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] border border-yellow-400/20 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.18)" }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-yellow-400/20 flex items-center justify-center text-3xl shadow-[0_6px_20px_rgba(255,215,0,0.4)] mx-auto mb-4">🏆</div>
                <h1 className="text-2xl font-bold text-white">{showSignup ? "Create Account" : "Welcome Back"}</h1>
                <p className="text-white/70 text-sm mt-1">{showSignup ? "Join as an admin officer" : "UP Cebu Intramurals Tracker"}</p>
              </div>

              {!showSignup ? (
                <form onSubmit={handleLogin}>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-white/90 mb-2">Username</label>
                    <input type="text" className={inputCls} placeholder="Enter your username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} required />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-white/90 mb-2">Password</label>
                    <input type="password" className={inputCls} placeholder="Enter your password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-semibold rounded-lg uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)] mt-2"
                    style={{ background: "linear-gradient(135deg, #FFD700 0%, #ffed4e 100%)", color: "#A91D3A" }}
                  >
                    Sign In
                  </button>
                  <p className="text-center text-yellow-400/80 text-sm mt-4 font-medium">Demo: admin / admin123</p>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  {["fullName", "username", "password", "confirmPassword"].map((field) => (
                    <div key={field} className="mb-4">
                      <label className="block text-sm font-semibold text-white/90 mb-2">
                        {{ fullName: "Full Name", username: "Username", password: "Password", confirmPassword: "Confirm Password" }[field]}
                      </label>
                      <input
                        type={field.toLowerCase().includes("password") ? "password" : "text"}
                        className={inputCls}
                        placeholder={{ fullName: "Enter your full name", username: "Create a username", password: "Create a password", confirmPassword: "Confirm your password" }[field]}
                        value={(signupForm as Record<string, string>)[field]}
                        onChange={(e) => setSignupForm({ ...signupForm, [field]: e.target.value })}
                        required
                      />
                    </div>
                  ))}
                  {signupMsg && (
                    <p className={`text-center text-sm font-semibold mb-3 ${signupMsg.ok ? "text-green-400" : "text-red-400"}`}>{signupMsg.text}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 font-semibold rounded-lg uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)] mt-2"
                    style={{ background: "linear-gradient(135deg, #FFD700 0%, #ffed4e 100%)", color: "#A91D3A" }}
                  >
                    Create Account
                  </button>
                </form>
              )}

              <p className="text-center text-white/80 text-sm mt-6">
                {showSignup ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => { setShowSignup(!showSignup); setSignupMsg(null); }}
                  className="text-yellow-400 font-bold hover:text-yellow-300 hover:underline cursor-pointer"
                >
                  {showSignup ? "Sign in" : "Create one"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
