// app/dashboard/layout.tsx

"use client";

import React, { useState } from "react";
import type { PageName } from "@/types";

// Import your new sidebar and the shadcn primitives
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// This layout will wrap all pages inside the /dashboard route
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");
  const [adminName, setAdminName] = useState("Isko Admin"); // Example admin

  const handleNavigate = (page: PageName) => {
    // In a real app with multiple pages, you would use:
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // router.push(`/dashboard/${page}`);
    
    // For now, we will just update the state to show active links
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        adminName={adminName}
      />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="text-sm font-semibold tracking-tight capitalize">{currentPage}</h1>
          </div>
          {/* You can add user menu or notifications here */}
        </header>

        {/* This is where the content of your page.tsx will be rendered */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
