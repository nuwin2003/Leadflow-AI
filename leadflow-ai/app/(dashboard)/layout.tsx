"use client";

import AppShell from "@/components/AppShell";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isHydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return <div className="h-screen bg-gray-50" />;
  }
  if (!isAuthenticated) {
    return <div className="h-screen bg-gray-50" />;
  }

  return <AppShell>{children}</AppShell>;
}
