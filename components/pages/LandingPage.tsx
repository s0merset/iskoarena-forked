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

  /**
   * Logic passed to the LoginPage Modal
   */
  const handleLoginSubmit = (username: string, password: string) => {
    const admin = AuthManager.verifyLogin(username, password);
    if (admin) {
      onLogin(admin);
      setIsLoginOpen(false);
      return { success: true };
    }
    return { success: false, message: "Invalid username or password." };
  };

  /**
   * Logic passed to the SignupPage Modal
   */
  const handleSignupSubmit = (fullName: string, username: string, password: string) => {
    const result = AuthManager.registerAdmin(fullName, username, password);
    if (result.success) {
      // Small delay before switching to login so user can see success message
      setTimeout(() => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
      }, 1500);
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section triggers the modals */}
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

      {/* Tailark Login Modal */}
      <LoginPage
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLoginSubmit}
        onToggleSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      {/* Tailark Signup Modal */}
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
