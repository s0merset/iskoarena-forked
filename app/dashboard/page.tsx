"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// IskoArena Dashboard Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Users, User, Calendar, ChevronRight } from "lucide-react";
import type { PageName } from "@/types";

export default function Page() {
  // 1. Manage the state required by AppSidebar
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");
  const adminName = "Isko Admin"; // This would normally come from your auth session

  const handleLogout = () => {
    console.log("Logging out...");
    // window.location.href = "/login"; 
  };

  return (
    <SidebarProvider>
      {/* 2. Pass the required props to AppSidebar */}
      <AppSidebar 
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={handleLogout}
        adminName={adminName}
      />
      
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Console</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* 3. The IskoArena Dashboard Content */}
        <div className="flex flex-1 flex-col gap-6 p-6 animate-in fade-in duration-700">
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Matches" value="24" icon={Trophy} />
            <StatCard label="Live Now" value="2" icon={Zap} isLive />
            <StatCard label="Total Teams" value="12" icon={Users} />
            <StatCard label="Total Players" value="148" icon={User} />
          </div>

          {/* Recent Matches Table */}
          <Card className="shadow-sm border-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold tracking-tight">Recent Matches</CardTitle>
                <CardDescription className="text-xs">Live reporting from the field.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                View Schedule <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                    <TableHead className="pl-6 h-10 text-[10px] uppercase font-bold tracking-wider">Sport</TableHead>
                    <TableHead className="h-10 text-[10px] uppercase font-bold tracking-wider">Matchup</TableHead>
                    <TableHead className="text-right pr-6 h-10 text-[10px] uppercase font-bold tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6 py-4 font-semibold text-xs">Basketball Men</TableCell>
                    <TableCell className="text-sm font-medium">Scions vs Tycoons</TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge className="bg-red-600 text-white rounded-md text-[9px] px-2 py-0 h-5">Live</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6 py-4 font-semibold text-xs">Volleyball Women</TableCell>
                    <TableCell className="text-sm font-medium">Phoenix vs Stallions</TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="secondary" className="rounded-md text-[9px] px-2 py-0 h-5">Finished</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Simple Helper Component for the Stats
function StatCard({ label, value, icon: Icon, isLive }: { label: string, value: string, icon: any, isLive?: boolean }) {
  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-bold tracking-tighter">{value}</p>
          </div>
          <div className={`p-2 rounded-md border border-border ${isLive ? 'bg-red-50 border-red-100 text-red-600' : 'bg-muted/20'}`}>
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
