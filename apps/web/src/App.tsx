import { useState } from "react"
import { Routes, Route } from "react-router-dom"
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

  if (!isAuthenticated) {
    return <LandingPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/raw-materials" element={<RawMaterialsPage />} />
        <Route path="/inventory" element={<InventoryOverviewPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/sales-orders" element={<SalesOrdersPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/settings"
          element={<div className="text-foreground">Settings</div>}
        />
      </Routes>
    </AppLayout>
  )
}

export function App() {
  return <AppContent />
}
