import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { LandingPage } from "@/pages/landing-page"
import { AuthCallbackPage } from "@/pages/auth-callback-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ProductsPage } from "@/pages/products-page"
import { InventoryOverviewPage } from "@/pages/inventory-overview-page"
import { SalesOrdersPage } from "@/pages/sales-orders-page"
import { PurchaseOrdersPage } from "@/pages/purchase-orders-page"
import { SuppliersPage } from "@/pages/suppliers-page"
import { ReportsPage } from "@/pages/reports-page"
import { SettingsPage } from "@/pages/settings-page"
import { supabase } from "@/lib/supabase"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const sb = supabase

    const checkAuth = async () => {
      const {
        data: { session },
      } = await sb.auth.getSession()
      if (session?.user) {
        setIsAuthenticated(true)
      } else {
        navigate("/")
      }
      setLoading(false)
    }
    checkAuth()

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        navigate("/")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [navigate])

  if (loading) return null
  if (!isAuthenticated) return null

  return <>{children}</>
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const sb = supabase

    const checkAuth = async () => {
      const {
        data: { session },
      } = await sb.auth.getSession()
      if (session?.user) {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    checkAuth()

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogin = () => {
    navigate("/dashboard")
  }

  if (loading) {
    return null
  }

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/products" element={<ProductsPage />} />
        <Route
          path="/dashboard/inventory"
          element={<InventoryOverviewPage />}
        />
        <Route path="/dashboard/sales-orders" element={<SalesOrdersPage />} />
        <Route
          path="/dashboard/purchase-orders"
          element={<PurchaseOrdersPage />}
        />
        <Route path="/dashboard/suppliers" element={<SuppliersPage />} />
        <Route path="/dashboard/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return <AppContent />
}
