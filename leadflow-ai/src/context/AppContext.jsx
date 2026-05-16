import React, { createContext, useContext, useState } from 'react'
import { INTEGRATIONS_DEFAULT, TENANT_CONFIGS } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentPage,   setCurrentPage]   = useState('dashboard')
  const [currentTenant, setCurrentTenant] = useState('all')
  const [viewMode,      setViewMode]      = useState('user')   // 'user' | 'admin'
  const [integrations,  setIntegrations]  = useState(INTEGRATIONS_DEFAULT)
  const [dailyLimit,    setDailyLimit]    = useState(50)

  const tenantConfig = TENANT_CONFIGS[currentTenant] || TENANT_CONFIGS.all

  function toggleIntegration(key) {
    setIntegrations(prev =>
      prev.map(int => int.key === key ? { ...int, connected: !int.connected } : int)
    )
  }

  function navigate(page) {
    setCurrentPage(page)
  }

  function switchView(mode) {
    setViewMode(mode)
    setCurrentPage(mode === 'admin' ? 'admin' : 'dashboard')
  }

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      currentTenant, setCurrentTenant,
      tenantConfig,
      viewMode, switchView,
      integrations, toggleIntegration,
      dailyLimit, setDailyLimit,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
