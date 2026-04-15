import { useState } from "react"
import { LandingNavbar } from "./landing-navbar"
import { LandingFooter } from "./landing-footer"
import { LoginModal } from "@/components/login-modal"
import { ChatBot } from "@/components/chatbot"

interface LandingLayoutProps {
  children: React.ReactNode
  onLoginSuccess?: () => void
}

export function LandingLayout({
  children,
  onLoginSuccess,
}: LandingLayoutProps) {
  const [showModal, setShowModal] = useState(false)

  const handleModalSuccess = () => {
    setShowModal(false)
    onLoginSuccess?.()
  }

  return (
    <div className="min-h-screen bg-background font-['Inter',system-ui,sans-serif]">
      <LandingNavbar onLogin={() => setShowModal(true)} />
      <main className="pt-14 sm:pt-16">{children}</main>
      <LandingFooter />
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />
      <ChatBot />
    </div>
  )
}
