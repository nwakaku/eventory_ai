import { useEffect, useState } from "react"
import { Search, Bell, ChevronDown, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { supabase } from "@/lib/supabase"
import { signOut } from "@/lib/auth"
import { useTheme } from "@/hooks/useTheme"

interface NavbarProps {
  sidebarCollapsed?: boolean
}

interface User {
  email?: string
}

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) return
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    }) || { data: { subscription: { unsubscribe: () => {} } } }

    return () => subscription?.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  const getInitials = (email?: string) => {
    if (!email) return "U"
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <header
      className="flex h-16 items-center justify-between border-b border-border bg-card px-4 transition-all duration-300"
      style={{ marginLeft: sidebarCollapsed ? "4rem" : "16rem" }}
    >
      <div className="flex flex-1 items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, orders, suppliers..."
            className="h-10 w-full rounded-lg border border-input bg-background pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-lg"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="relative">
          <button
            className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-accent"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {getInitials(user?.email)}
            </div>
            <div className="hidden items-center gap-1 text-sm md:flex">
              <span className="font-medium text-foreground">
                {user?.email || "User"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg">
              <div className="border-b border-border p-3">
                <p className="text-sm font-medium text-foreground">
                  {user?.email || "User"}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
