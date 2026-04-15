import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { LandingPage } from "@/pages/landing-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ProductsPage } from "@/pages/products-page"
import { InventoryOverviewPage } from "@/pages/inventory-overview-page"
import { SalesOrdersPage } from "@/pages/sales-orders-page"
import { PurchaseOrdersPage } from "@/pages/purchase-orders-page"
import { SuppliersPage } from "@/pages/suppliers-page"
import { ReportsPage } from "@/pages/reports-page"
import { SettingsPage } from "@/pages/settings-page"

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsAuthenticated(true)
    navigate("/dashboard")
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />
  }

  return (
    <AppLayout>
      <Routes>
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
      </Routes>
    </AppLayout>
  )
}

export function App() {
  return <AppContent />
}
