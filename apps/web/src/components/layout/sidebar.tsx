import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  ChevronLeft,
  X,
  ClipboardList,
  BarChart3,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Inventory", href: "/dashboard/inventory", icon: ClipboardList },
  { name: "Sales Orders", href: "/dashboard/sales-orders", icon: ShoppingCart },
  { name: "Purchase Orders", href: "/dashboard/purchase-orders", icon: Truck },
  { name: "Suppliers", href: "/dashboard/suppliers", icon: Users },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && !isMobile && (
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1746566762/growth_ggcqxd.png"
              alt="Easivent"
              className="h-8 w-8 object-contain"
            />
            <span className="font-semibold text-sidebar-foreground">
              Easivent
            </span>
          </div>
        )}
        {(collapsed || isMobile) && (
          <img
            src="https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1746566762/growth_ggcqxd.png"
            alt="Easivent"
            className="mx-auto h-8 w-8 object-contain"
          />
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                (collapsed || isMobile) && "justify-center px-2"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && !isMobile && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <NavLink
          to="/settings"
          onClick={handleNavClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              (collapsed || isMobile) && "justify-center px-2"
            )
          }
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && !isMobile && <span>Settings</span>}
        </NavLink>

        {!isMobile && (
          <button
            onClick={onToggle}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 shrink-0 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onMobileClose}
          />
        )}

        <aside
          className={cn(
            "fixed top-0 bottom-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 left-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  )
}
