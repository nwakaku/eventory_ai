import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface LandingNavbarProps {
  onLogin?: () => void
}

export function LandingNavbar({ onLogin }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
              <svg
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-base font-semibold text-foreground sm:text-lg">
              Enventory
            </span>
          </div>

          <div className="hidden items-center gap-6 md:gap-8 lg:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("integrations")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollToSection("visibility")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection("support")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Support
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            <Button
              className="hidden h-9 px-4 text-sm lg:flex"
              onClick={onLogin}
            >
              Get Started
            </Button>

            <button
              className="p-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-14 sm:pt-16 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 sm:p-6">
            <button
              onClick={() => scrollToSection("features")}
              className="py-2 text-left text-base text-foreground sm:text-lg"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("integrations")}
              className="py-2 text-left text-base text-foreground sm:text-lg"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollToSection("visibility")}
              className="py-2 text-left text-base text-foreground sm:text-lg"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection("support")}
              className="py-2 text-left text-base text-foreground sm:text-lg"
            >
              Support
            </button>
            <div className="mt-4 border-t border-border pt-4">
              <Button className="h-11 w-full" onClick={onLogin}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
