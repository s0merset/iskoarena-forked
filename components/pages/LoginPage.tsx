"use client";

import React, { useState } from "react";
import { AuthManager } from "@/lib/dataManager";
import type { Admin } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, ArrowRight, UserPlus, LogIn } from "lucide-react";

interface LoginPageProps {
  onLogin: (admin: Admin) => void;
}

const newsItems = [
  {
    date: "Feb 20, 2026",
    title: "Basketball Tournament 2026",
    body: "Join the most exciting basketball tournament of the year! COS Scions, SOM Tycoons, and more compete for glory.",
    variant: "maroon",
  },
  {
    date: "Feb 18, 2026",
    title: "Women's Volleyball Finals",
    body: "The CSS Stallions take on CCAD Phoenix in an intense match. Watch the live coverage and see who wins!",
    variant: "gold",
  },
  {
    date: "Feb 16, 2026",
    title: "Mobile Legends: Bang Bang",
    body: "Experience the ultimate gaming competition! Teams compete in intense matches across multiple titles.",
    variant: "maroon-dark",
  },
];

const bgColors: Record<string, string> = {
  maroon: "bg-maroon-primary border-maroon-secondary text-white",
  gold: "bg-gold-primary border-yellow-600 text-maroon-primary",
  "maroon-dark": "bg-maroon-secondary border-black/20 text-white",
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showSignup, setShowSignup] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [signupMsg, setSignupMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = AuthManager.verifyLogin(loginForm.username, loginForm.password);
    if (admin) onLogin(admin);
    else alert("Invalid username or password");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMsg(null);
    const { fullName, username, password, confirmPassword } = signupForm;

    if (password !== confirmPassword) {
      setSignupMsg({ text: "Passwords do not match", ok: false });
      return;
    }

    const result = AuthManager.registerAdmin(fullName, username, password);
    setSignupMsg({ text: result.message, ok: result.success });
    if (result.success) {
      setSignupForm({ fullName: "", username: "", password: "", confirmPassword: "" });
      setTimeout(() => setShowSignup(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-primary to-maroon-secondary text-white selection:bg-gold-primary selection:text-maroon-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-maroon-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-primary" />
            <span className="text-xl font-bold tracking-tight text-gold-primary">IskoArena</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={!showSignup ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setShowSignup(false)}
            >
              Login
            </Button>
            <Button 
              variant={showSignup ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* News Section */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gold-primary mb-2">Latest Updates</h2>
            <p className="text-white/60">Stay tuned with UP Cebu Intramurals news.</p>
          </div>
          
          <div className="grid gap-4">
            {newsItems.map((item) => (
              <Card key={item.title} className={`${bgColors[item.variant]} border transition-all hover:scale-[1.02]`}>
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{item.date}</p>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed opacity-90">{item.body}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent text-inherit font-bold">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Auth Section */}
        <section className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white text-slate-950 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-maroon-primary rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-gold-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {showSignup ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {showSignup ? "Join as an admin officer" : "Enter your credentials to manage IskoArena"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={showSignup ? handleSignup : handleLogin} className="space-y-4">
                {showSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="admin_isko"
                    value={showSignup ? signupForm.username : loginForm.username}
                    onChange={(e) => showSignup 
                      ? setSignupForm({ ...signupForm, username: e.target.value })
                      : setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={showSignup ? signupForm.password : loginForm.password}
                    onChange={(e) => showSignup 
                      ? setSignupForm({ ...signupForm, password: e.target.value })
                      : setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>

                {showSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                )}

                {signupMsg && (
                  <div className={`p-3 rounded-md text-sm text-center font-medium ${signupMsg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {signupMsg.text}
                  </div>
                )}

                <Button type="submit" className="w-full bg-maroon-primary hover:bg-maroon-secondary text-white">
                  {showSignup ? (
                    <><UserPlus className="mr-2 w-4 h-4" /> Register</>
                  ) : (
                    <><LogIn className="mr-2 w-4 h-4" /> Sign In</>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t pt-6">
              {!showSignup && (
                <p className="text-xs text-center text-slate-500 italic">
                  Demo Access: <span className="font-bold text-maroon-primary">admin / admin123</span>
                </p>
              )}
              <div className="text-sm text-center text-slate-600">
                {showSignup ? "Already have an account?" : "New to the platform?"}
                <Button 
                  variant="link" 
                  className="px-2 text-maroon-primary font-bold" 
                  onClick={() => { setShowSignup(!showSignup); setSignupMsg(null); }}
                >
                  {showSignup ? "Log in here" : "Create an account"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}
