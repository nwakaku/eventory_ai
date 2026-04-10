import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Package, AlertTriangle, ShoppingCart, DollarSign, ArrowUpRight, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { useGetAllProducts } from "@/hooks/useProducts"
import { useGetAllSalesOrders } from "@/hooks/useSalesOrders"
import { supabase } from "@/lib/supabase"

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: products, isLoading: loadingProducts } = useGetAllProducts()
  const { data: salesOrders, isLoading: loadingSales } = useGetAllSalesOrders()
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (!supabase) return

    const client = supabase
    const productsChannel = client
      .channel("products-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        setLastUpdated(new Date())
      })
      .subscribe()

    const ordersChannel = client
      .channel("sales-orders-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_orders" }, () => {
        setLastUpdated(new Date())
      })
      .subscribe()

    return () => {
      client.removeChannel(productsChannel)
      client.removeChannel(ordersChannel)
    }
  }, [])

  const stats = useMemo(() => {
    if (!products || !salesOrders) {
      return {
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        openOrdersCount: 0,
        stockValue: 0,
      }
    }

    const totalProducts = products.length
    const lowStockCount = products.filter(p => (p.stock_on_hand || 0) <= (p.reorder_point || 0) && (p.stock_on_hand || 0) > 0).length
    const outOfStockCount = products.filter(p => (p.stock_on_hand || 0) === 0).length
    const openOrdersCount = salesOrders.filter(o => o.status === "Pending").length
    const stockValue = products.reduce((sum, p) => sum + ((p.stock_on_hand || 0) * (p.unit_price || 0)), 0)

    return { totalProducts, lowStockCount, outOfStockCount, openOrdersCount, stockValue }
  }, [products, salesOrders])

  const reorderAlerts = useMemo(() => {
    if (!products) return []
    return products.filter(p => (p.stock_on_hand || 0) <= (p.reorder_point || 0))
  }, [products])

  const recentOrders = useMemo(() => {
    if (!salesOrders) return []
    return [...salesOrders]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5)
  }, [salesOrders])

  const chartData = useMemo(() => {
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

    return Object.entries(ordersByDate).map(([day, orders]) => ({ day, orders }))
  }, [salesOrders])

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || "-"
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "secondary"> = {
      "Fulfilled": "success",
      "Pending": "warning",
      "Archived": "secondary",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  if (loadingProducts || loadingSales) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const { totalProducts, lowStockCount, outOfStockCount, openOrdersCount, stockValue } = stats

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Last updated:</span>
          <span className="font-medium text-foreground">{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-foreground tracking-tight">{totalProducts}</span>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-destructive/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Low Stock Alerts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-foreground tracking-tight">{lowStockCount + outOfStockCount}</span>
            <div className="flex items-center gap-1 text-sm font-medium text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Open Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-foreground tracking-tight">{openOrdersCount}</span>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Stock Value</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold text-foreground tracking-tight">${(stockValue / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Sales Orders (Last 30 Days)</h3>
              <p className="text-sm text-muted-foreground">Daily order count</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} labelStyle={{ color: "#1A1A2E", fontWeight: 500 }} />
                <Line type="monotone" dataKey="orders" stroke="#1F6FEB" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#1F6FEB", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold text-foreground">Recent Sales Orders</h3>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{getProductName(order.product_id)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">${(order.total || 0).toLocaleString()}</p>
                  {getStatusBadge(order.status || "Pending")}
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No recent orders</div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <Button variant="ghost" className="w-full gap-2" onClick={() => navigate('/sales-orders')}>
              View All Orders
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Reorder Alerts</h3>
              <p className="text-sm text-muted-foreground">Products below reorder threshold</p>
            </div>
          </div>
          <span className="text-sm font-medium text-destructive">{reorderAlerts.length} items need attention</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reorderAlerts.map((item) => {
              const isCritical = (item.stock_on_hand || 0) === 0
              const percent = item.reorder_point ? Math.min(((item.stock_on_hand || 0) / item.reorder_point) * 100, 100) : 0
              return (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4"><span className="font-medium text-foreground">{item.name}</span></td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{item.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${isCritical ? "bg-destructive" : "bg-yellow-500"}`} style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.stock_on_hand}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.reorder_point}</td>
                  <td className="px-6 py-4">
                    <Badge variant={isCritical ? "danger" : "warning"} className="uppercase tracking-wide">{isCritical ? "Out of Stock" : "Low Stock"}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/purchase-orders')}>
                      Create PO <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              )
            })}
            {reorderAlerts.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">All products are well stocked</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
