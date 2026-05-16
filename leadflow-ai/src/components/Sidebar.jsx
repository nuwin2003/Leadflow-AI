import React from 'react'
import {
  LayoutDashboard, Users, Megaphone, Plug, BarChart2,
  Settings, ShieldCheck, Zap, ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV_MAIN = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'leads',        label: 'Leads',        Icon: Users           },
  { id: 'campaigns',    label: 'Campaigns',    Icon: Megaphone       },
  { id: 'integrations', label: 'Integrations', Icon: Plug            },
  { id: 'analytics',    label: 'Analytics',    Icon: BarChart2       },
]

const NAV_CONFIG = [
  { id: 'config', label: 'User Config',  Icon: Settings    },
  { id: 'admin',  label: 'Super Admin',  Icon: ShieldCheck },
]

export default function Sidebar() {
  const { currentPage, navigate } = useApp()

  function NavItem({ id, label, Icon }) {
    const active = currentPage === id
    return (
      <button
        onClick={() => navigate(id)}
        className={`sidebar-nav-item w-full text-left ${active ? 'active' : ''}`}
      >
        <Icon size={17} />
        <span>{label}</span>
        {active && <ChevronRight size={13} className="ml-auto opacity-40" />}
      </button>
    )
  }

  return (
    <aside className="w-56 min-w-56 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">LeadFlow AI</p>
          <p className="text-[10px] text-gray-400 leading-tight">B2B Sales Automation</p>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-2.5 pt-4">
        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest px-2 mb-2">
          Main
        </p>
        <nav className="flex flex-col gap-0.5 mb-4">
          {NAV_MAIN.map(item => <NavItem key={item.id} {...item} />)}
        </nav>

        <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest px-2 mb-2 mt-4">
          Settings
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_CONFIG.map(item => <NavItem key={item.id} {...item} />)}
        </nav>
      </div>

      {/* User pill */}
      <div className="px-2.5 py-3 border-t border-gray-100">
        <button className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-brand-600">AC</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-medium text-gray-800 truncate">Admin Client</p>
            <p className="text-[10px] text-gray-400">client_001</p>
          </div>
          <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
        </button>
      </div>
    </aside>
  )
}
