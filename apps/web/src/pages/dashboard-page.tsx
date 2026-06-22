import { useEffect, useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  Users,
  CoinsIcon,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { useGetAllProducts } from "@/hooks/useProducts"
import { useGetAllTransactions } from "@/hooks/useTransactions"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"
import { supabase } from "@/lib/supabase"

const formatNGN = (amount: number): string => {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}K`
  }
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`
}

export function DashboardPage() {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts()
  const { data: transactions, isLoading: loadingTransactions } =
    useGetAllTransactions()
  const { data: suppliers } = useGetAllSuppliers()
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (!supabase) return

    const client = supabase
    const productsChannel = client
      .channel("products-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          setLastUpdated(new Date())
        }
      )
      .subscribe()

    const transactionsChannel = client
      .channel("transactions-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          setLastUpdated(new Date())
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(productsChannel)
      client.removeChannel(transactionsChannel)
    }
  }, [])

  const stats = useMemo(() => {
    if (!products) {
      return {
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        inventoryValue: 0,
        todaySales: 0,
        todayRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
      }
    }

    const totalProducts = products.length
    const lowStockCount = products.filter(
      (p) =>
        (p.stock_on_hand || 0) <= (p.reorder_point || 0) &&
        (p.stock_on_hand || 0) > 0
    ).length
    const outOfStockCount = products.filter(
      (p) => (p.stock_on_hand || 0) === 0
    ).length
    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.stock_on_hand || 0) * (p.unit_price || 0),
      0
    )

    const today = new Date().toDateString()
    const todayTransactions =
      transactions?.filter(
        (t) => new Date(t.created_at || "").toDateString() === today
      ) || []
    const todaySales = todayTransactions.length
    const todayRevenue = todayTransactions.reduce(
      (sum, t) => sum + (t.total || 0),
      0
    )

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekTransactions =
      transactions?.filter(
        (t) => t.created_at && new Date(t.created_at) >= weekAgo
      ) || []
    const weeklyRevenue = weekTransactions.reduce(
      (sum, t) => sum + (t.total || 0),
      0
    )

    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthTransactions =
      transactions?.filter(
        (t) => t.created_at && new Date(t.created_at) >= monthAgo
      ) || []
    const monthlyRevenue = monthTransactions.reduce(
      (sum, t) => sum + (t.total || 0),
      0
    )

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      inventoryValue,
      todaySales,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
    }
  }, [products, transactions])

  const lowStockItems = useMemo(() => {
    if (!products) return []
    return products
      .filter((p) => (p.stock_on_hand || 0) <= (p.reorder_point || 0))
      .slice(0, 5)
  }, [products])

  const expiringSoon = useMemo(() => {
    if (!products) return []
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    return products
      .filter(
        (p) => p.expiry_date && new Date(p.expiry_date) <= sevenDaysFromNow
      )
      .sort(
        (a, b) =>
          new Date(a.expiry_date || 0).getTime() -
          new Date(b.expiry_date || 0).getTime()
      )
      .slice(0, 5)
  }, [products])

  const salesChartData = useMemo(() => {
    if (!transactions) return []

    const last7Days: Record<string, { sales: number; revenue: number }> = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString("en-US", { weekday: "short" })
      last7Days[key] = { sales: 0, revenue: 0 }
    }

    transactions.forEach((t) => {
      if (!t.created_at) return
      const date = new Date(t.created_at)
      const diff = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (diff <= 6) {
        const key = date.toLocaleDateString("en-US", { weekday: "short" })
        if (last7Days[key]) {
          last7Days[key].sales += 1
          last7Days[key].revenue += t.total || 0
        }
      }
    })

    return Object.entries(last7Days).map(([day, data]) => ({ day, ...data }))
  }, [transactions])

  const categoryBreakdown = useMemo(() => {
    if (!products) return []
    const categories: Record<string, { count: number; value: number }> = {}
    products.forEach((p) => {
      const cat = p.category || "Uncategorized"
      if (!categories[cat]) {
        categories[cat] = { count: 0, value: 0 }
      }
      categories[cat].count += 1
      categories[cat].value += (p.stock_on_hand || 0) * (p.unit_price || 0)
    })
    return Object.entries(categories)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
  }, [products])

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    if (days <= 0) return { label: "Expired", variant: "danger" as const }
    if (days <= 3) return { label: `${days}d left`, variant: "danger" as const }
    if (days <= 7)
      return { label: `${days}d left`, variant: "warning" as const }
    return { label: `${days}d left`, variant: "secondary" as const }
  }

  if (loadingProducts || loadingTransactions) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const {
    totalProducts,
    lowStockCount,
    outOfStockCount,
    inventoryValue,
    todaySales,
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
  } = stats

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Shop overview & performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Updated:</span>
          <span className="font-medium text-foreground">
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Products
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {totalProducts}
            </span>
            <span className="text-xs text-muted-foreground">items</span>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-green-500/20 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Today's Sales
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 transition-colors group-hover:bg-green-500/20">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {todaySales}
            </span>
            <span className="text-sm font-medium text-green-600">
              {formatNGN(todayRevenue)}
            </span>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-blue-500/20 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              This Week
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {formatNGN(weeklyRevenue)}
            </span>
            <span className="text-xs text-muted-foreground">revenue</span>
          </div>
        </div>

        <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-destructive/20 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Low Stock
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 transition-colors group-hover:bg-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {lowStockCount + outOfStockCount}
            </span>
            {lowStockCount + outOfStockCount > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Weekly Sales</h3>
              <p className="text-sm text-muted-foreground">
                Transaction count - last 7 days
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#1A1A2E", fontWeight: 500 }}
                  formatter={(value) => [`${value} sales`, "Count"]}
                />
                <Bar dataKey="sales" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">
                Category Breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                Inventory value by category
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatNGN(cat.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(
                          (cat.value / (categoryBreakdown[0]?.value || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {cat.count} items
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Low Stock Alerts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Items below reorder level
                </p>
              </div>
            </div>
            <Badge variant="destructive">{lowStockItems.length}</Badge>
          </div>
          <div className="divide-y divide-border">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {item.stock_on_hand} left
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Min: {item.reorder_point}
                  </p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                All products well stocked
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Expiring Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Items expiring within 7 days
                </p>
              </div>
            </div>
            <Badge variant="outline">{expiringSoon.length}</Badge>
          </div>
          <div className="divide-y divide-border">
            {expiringSoon.map((item) => {
              const status = getExpiryStatus(item.expiry_date)
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={status?.variant || "secondary"}>
                    {status?.label || "-"}
                  </Badge>
                </div>
              )
            })}
            {expiringSoon.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No items expiring soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
