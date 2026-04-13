import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { LandingPage } from "@/pages/landing-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ProductsPage } from "@/pages/products-page"
import { RawMaterialsPage } from "@/pages/raw-materials-page"
import { InventoryOverviewPage } from "@/pages/inventory-overview-page"
import { ProductionPage } from "@/pages/production-page"
import { SalesOrdersPage } from "@/pages/sales-orders-page"
import { PurchaseOrdersPage } from "@/pages/purchase-orders-page"
import { SuppliersPage } from "@/pages/suppliers-page"
import { ReportsPage } from "@/pages/reports-page"

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsAuthenticated(true)
    navigate("/dashboard")
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <LandingPage onLogin={handleLogin} />
    }
    return <AppLayout>{children}</AppLayout>
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/raw-materials"
        element={
          <ProtectedRoute>
            <RawMaterialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/production"
        element={
          <ProtectedRoute>
            <ProductionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-orders"
        element={
          <ProtectedRoute>
            <SalesOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute>
            <PurchaseOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <SuppliersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="text-foreground">Settings</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export function App() {
  return <AppContent />
}
