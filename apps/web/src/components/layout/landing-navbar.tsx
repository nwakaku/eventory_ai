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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between sm:h-16">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1746566762/growth_ggcqxd.png"
              alt="Enventory Logo"
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
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
