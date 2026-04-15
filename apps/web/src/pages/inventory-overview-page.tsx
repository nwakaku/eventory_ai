import { useState, useMemo } from "react"
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useGetAllProducts } from "@/hooks/useProducts"

const ITEMS_PER_PAGE = 10

export function InventoryOverviewPage() {
  const { data: products, isLoading } = useGetAllProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => {
        const stock = p.stock_on_hand || 0
        const reorder = p.reorder_point || 0

        if (statusFilter === "in-stock") return stock > reorder
        if (statusFilter === "low-stock") return stock <= reorder && stock > 0
        if (statusFilter === "out-of-stock") return stock === 0
        return true
      })
    }

    return filtered
  }, [products, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const inventoryStats = useMemo(() => {
    if (!products) return { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 }

    const total = products.length
    const inStock = products.filter(
      (p) => (p.stock_on_hand || 0) > (p.reorder_point || 0)
    ).length
    const lowStock = products.filter(
      (p) =>
        (p.stock_on_hand || 0) <= (p.reorder_point || 0) &&
        (p.stock_on_hand || 0) > 0
    ).length
    const outOfStock = products.filter(
      (p) => (p.stock_on_hand || 0) === 0
    ).length

    return { total, inStock, lowStock, outOfStock }
  }, [products])

  const getStatus = (product: {
    id: string
    stock_on_hand: number | null
    reorder_point: number | null
    name: string
    sku: string
    category: string | null
  }) => {
    const stock = product.stock_on_hand || 0
    const reorder = product.reorder_point || 0

    if (stock === 0)
      return {
        label: "Out of Stock",
        variant: "danger" as const,
        icon: XCircle,
      }
    if (stock <= reorder)
      return {
        label: "Low Stock",
        variant: "warning" as const,
        icon: AlertTriangle,
      }
    return { label: "In Stock", variant: "success" as const, icon: CheckCircle }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Track your product stock levels
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-semibold text-foreground">
                {inventoryStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-semibold text-foreground">
                {inventoryStats.inStock}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-semibold text-foreground">
                {inventoryStats.lowStock}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-semibold text-foreground">
                {inventoryStats.outOfStock}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold text-foreground">All Products</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Reorder Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProducts.map((product) => {
                const status = getStatus(product)
                const StockIcon = status.icon
                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${(product.stock_on_hand || 0) <= (product.reorder_point || 0) ? "text-destructive" : "text-foreground"}`}
                      >
                        {product.stock_on_hand || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.reorder_point || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant} className="gap-1">
                        <StockIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {paginatedProducts.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No products found. Add products to see inventory.
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}{" "}
              of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
