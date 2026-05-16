import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar   from './components/Sidebar'
import Topbar    from './components/Topbar'
import DashboardPage   from './pages/DashboardPage'
import LeadsPage       from './pages/LeadsPage'
import CampaignsPage   from './pages/CampaignsPage'
import IntegrationsPage from './pages/IntegrationsPage'
import AnalyticsPage   from './pages/AnalyticsPage'
import ConfigPage      from './pages/ConfigPage'
import AdminPage       from './pages/AdminPage'

function PageRouter() {
  const { currentPage } = useApp()

  const pages = {
    dashboard:    <DashboardPage    />,
    leads:        <LeadsPage        />,
    campaigns:    <CampaignsPage    />,
    integrations: <IntegrationsPage />,
    analytics:    <AnalyticsPage    />,
    config:       <ConfigPage       />,
    admin:        <AdminPage        />,
  }

  return pages[currentPage] ?? <DashboardPage />
}

function Shell() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <PageRouter />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
