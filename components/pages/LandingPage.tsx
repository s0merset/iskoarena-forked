"use client";

import React, { useState } from "react";
import { AuthManager } from "@/lib/dataManager";
import type { Admin } from "@/types";

// UI Sections
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-12";
import ContentSection from "@/components/content-2";
import TeamSection from "@/components/team";
import FAQsThree from "@/components/faqs-3";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";

// Tailark Modals
import LoginPage from "@/components/login";
import SignupPage from '@/components/sign-up';

interface LandingPageProps {
  onLogin: (admin: Admin) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  // Modal Visibility States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLoginSubmit = (username: string, password: string) => {
    const admin = AuthManager.verifyLogin(username, password);
    if (admin) {
      onLogin(admin);
      setIsLoginOpen(false);
      return { success: true };
    }
    return { success: false, message: "Invalid username or password." };
  };

  const handleSignupSubmit = (fullName: string, username: string, password: string) => {
    const result = AuthManager.registerAdmin(fullName, username, password);
    if (result.success) {
      setTimeout(() => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
      }, 1500);
    }
    return result;
  };

  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* 1. Sections */}
      <HeroSection
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
      />

      <Features />
      <ContentSection />
      <FAQsThree />
      <TeamSection />
      <CallToAction />
      <FooterSection />

      {/* 2. GLOBAL VIEWPORT BLUR (Added here) */}
      {/* 
          - fixed bottom-0: Sticks to the bottom of the browser window
          - pointer-events-none: Critical so you can still click buttons behind the blur
          - z-[50]: Sits above the sections but below the modals
      */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-[50] backdrop-blur-sm [mask-image:linear-gradient(to_top,black_20%,transparent)]"
        aria-hidden="true"
      />

      {/* 3. Modals (High Z-Index) */}
      <LoginPage
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLoginSubmit}
        onToggleSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      <SignupPage
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSubmit={handleSignupSubmit}
        onToggleLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
