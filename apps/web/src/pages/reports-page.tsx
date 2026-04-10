import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { BarChart3, TrendingUp, ShoppingCart, Package, Loader2 } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { useGetAllProducts } from "@/hooks/useProducts"
import { useGetAllSalesOrders } from "@/hooks/useSalesOrders"
import { useGetAllPurchaseOrders } from "@/hooks/usePurchaseOrders"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"

const tabs = [
  { id: "stock-health", label: "Stock Health", icon: BarChart3 },
  { id: "sales-velocity", label: "Sales Velocity", icon: TrendingUp },
  { id: "reorder-history", label: "Reorder History", icon: ShoppingCart },
]

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("stock-health")
  const { data: products, isLoading: loadingProducts } = useGetAllProducts()
  const { data: salesOrders } = useGetAllSalesOrders()
  const { data: purchaseOrders } = useGetAllPurchaseOrders()
  const { data: suppliers } = useGetAllSuppliers()

  const stockHealthData = useMemo(() => {
    if (!products) return []
    return products.map((p) => ({
      name: p.name?.split(" ")[0] || "Unknown",
      stock: p.stock_on_hand || 0,
      reorder: p.reorder_point || 0,
      full: p.name,
    }))
  }, [products])

  const salesVelocityData = useMemo(() => {
    if (!salesOrders) return []

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const ordersByDate: Record<string, number> = {}
    salesOrders.forEach(order => {
      if (!order.created_at) return
      const date = new Date(order.created_at)
      if (date >= thirtyDaysAgo) {
        const key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        ordersByDate[key] = (ordersByDate[key] || 0) + 1
      }
    })

    return Object.entries(ordersByDate).map(([month, orders]) => ({ month, orders }))
  }, [salesOrders])

  const topProducts = useMemo(() => {
    if (!salesOrders || !products) return []

    const productTotals: Record<string, { name: string; quantity: number; revenue: number }> = {}
    salesOrders.forEach(order => {
      if (order.status === "Fulfilled" && order.product_id && order.quantity) {
        const product = products.find(p => p.id === order.product_id)
        if (product) {
          if (!productTotals[order.product_id]) {
            productTotals[order.product_id] = {
              name: product.name,
              quantity: 0,
              revenue: 0,
            }
          }
          productTotals[order.product_id].quantity += order.quantity
          productTotals[order.product_id].revenue += (order.total || 0)
        }
      }
    })

    return Object.values(productTotals)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [salesOrders, products])

  const sortedPurchaseOrders = useMemo(() => {
    if (!purchaseOrders) return []
    return [...purchaseOrders]
      .filter(o => o.status === "received")
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }, [purchaseOrders])

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || "-"
  }

  const getSupplierName = (supplierId: string) => {
    return suppliers?.find(s => s.id === supplierId)?.name || "-"
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "warning" | "success"> = {
      draft: "secondary",
      sent: "warning",
      received: "success",
    }
    return <Badge variant={variants[status] || "secondary"} className="capitalize">{status}</Badge>
  }

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights</p>
      </div>

      <div className="flex items-center gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in duration-200 fade-in">
        {activeTab === "stock-health" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 font-semibold text-foreground">Stock vs Reorder Point</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockHealthData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} width={100} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-lg">
                              <p className="font-medium text-foreground">{data.full}</p>
                              <p className="text-sm text-muted-foreground">Stock: {data.stock}</p>
                              <p className="text-sm text-muted-foreground">Reorder Point: {data.reorder}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="stock" fill="#1F6FEB" radius={[0, 4, 4, 0]} name="Current Stock" />
                    <Bar dataKey="reorder" fill="#E5E7EB" radius={[0, 4, 4, 0]} name="Reorder Point" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#1F6FEB]" />
                  <span className="text-muted-foreground">Current Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#E5E7EB]" />
                  <span className="text-muted-foreground">Reorder Point</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Total SKUs</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{products?.length || 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Above Reorder</p>
                <p className="mt-1 text-2xl font-semibold text-[#00C853]">
                  {products?.filter(p => (p.stock_on_hand || 0) > (p.reorder_point || 0)).length || 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Below Reorder</p>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">
                  {products?.filter(p => (p.stock_on_hand || 0) <= (p.reorder_point || 0) && (p.stock_on_hand || 0) > 0).length || 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="mt-1 text-2xl font-semibold text-destructive">
                  {products?.filter(p => (p.stock_on_hand || 0) === 0).length || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sales-velocity" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 font-semibold text-foreground">Orders Over Time (30 Days)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesVelocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} labelStyle={{ color: "#1A1A2E", fontWeight: 500 }} />
                    <Line type="monotone" dataKey="orders" stroke="#1F6FEB" strokeWidth={2} dot={{ fill: "#1F6FEB", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#1F6FEB", strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4">
                <h3 className="font-semibold text-foreground">Top Selling Products</h3>
              </div>
              <div className="divide-y divide-border">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        index === 0 ? "bg-[#FFD700]/20 text-[#FFD700]" : index === 1 ? "bg-gray-300/50 text-gray-600" : index === 2 ? "bg-amber-600/20 text-amber-700" : "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground">${product.revenue.toLocaleString()}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">No sales data available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reorder-history" && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4">
                <h3 className="font-semibold text-foreground">Purchase Order History (Received)</h3>
              </div>
              {sortedPurchaseOrders.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">PO Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">Product</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedPurchaseOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm font-medium text-primary">{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{getSupplierName(order.supplier_id)}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{getProductName(order.product_id)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">{order.quantity}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(order.status || "received")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">No purchase orders yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Purchase orders will appear here once created.</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Total POs</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{purchaseOrders?.length || 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  ${purchaseOrders?.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="mt-1 text-2xl font-semibold text-[#00C853]">
                  {purchaseOrders?.filter(o => o.status === "received").length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
