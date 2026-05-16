"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart2,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Plug,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const NAV_MAIN: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/leads", label: "Leads", Icon: Users },
  { href: "/campaigns", label: "Campaigns", Icon: Megaphone },
  { href: "/integrations", label: "Integrations", Icon: Plug },
  { href: "/analytics", label: "Analytics", Icon: BarChart2 },
];

const NAV_CONFIG: NavItem[] = [
  { href: "/config", label: "User Config", Icon: Settings },
  { href: "/admin", label: "Super Admin", Icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser, userProfile } = useApp();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function NavLink({ href, label, Icon }: NavItem) {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`sidebar-nav-item w-full text-left ${active ? "active" : ""}`}
      >
        <Icon size={17} />
        <span>{label}</span>
        {active && <ChevronRight size={13} className="ml-auto opacity-40" />}
      </Link>
    );
  }

  function handleLogout() {
    setOpenProfileMenu(false);
    logoutUser();
    router.push("/login");
  }

  const profileInitials = `${userProfile?.firstName?.[0] ?? "A"}${userProfile?.lastName?.[0] ?? "C"}`;
  const profileName =
    userProfile?.firstName && userProfile?.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : "Admin Client";
  const profileCompany = userProfile?.companyName ?? "client_001";

  return (
    <aside className="w-56 min-w-56 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">LeadFlow AI</p>
          <p className="text-[10px] text-gray-400 leading-tight">B2B Sales Automation</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pt-4">
        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest px-2 mb-2">
          Main
        </p>
        <nav className="flex flex-col gap-0.5 mb-4">
          {NAV_MAIN.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest px-2 mb-2 mt-4">
          Onboarding
        </p>
        <nav className="flex flex-col gap-0.5 mb-4">
          <NavLink href="/import" label="Import CSV" Icon={FileSpreadsheet} />
        </nav>

        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest px-2 mb-2 mt-4">
          Settings
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_CONFIG.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className="relative px-2.5 py-3 border-t border-gray-100">
        <button
          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setOpenProfileMenu((prev) => !prev)}
          aria-label="Open profile actions"
        >
          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-brand-600">{profileInitials}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-medium text-gray-800 truncate">{profileName}</p>
            <p className="text-[10px] text-gray-400 truncate">{profileCompany}</p>
          </div>
          <MoreHorizontal size={14} className="text-gray-400 flex-shrink-0" />
        </button>

        {openProfileMenu ? (
          <div className="absolute bottom-[64px] left-2.5 right-2.5 rounded-lg border border-gray-200 bg-white p-1.5 shadow-md">
            <button
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
