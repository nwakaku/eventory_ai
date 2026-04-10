import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex flex-1 flex-col">
        <Navbar sidebarCollapsed={collapsed} />

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
