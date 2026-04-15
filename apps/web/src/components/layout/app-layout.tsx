import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { ChatBot } from "@/components/chatbot"
import { cn } from "@workspace/ui/lib/utils"

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ChatBot />
    </div>
  )
}
