import { AlertTriangle, Package, TrendingDown, ArrowRight } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { useInventory } from "@/context/inventory-context"

function InventoryCard({
  item,
  type,
}: {
  item: {
    id: number
    name: string
    sku: string
    stock: number
    reorderPoint: number
    unit: string
  }
  type: "product" | "material"
}) {
  const ratio = item.stock / item.reorderPoint
  const isCritical = ratio <= 0.5 || item.stock === 0
  const isLow = ratio <= 1
  const statusColor = isCritical
    ? "bg-red-500"
    : isLow
      ? "bg-yellow-500"
      : "bg-[#00C853]"
  const statusBg = isCritical
    ? "bg-red-50 border-red-200"
    : isLow
      ? "bg-yellow-50 border-yellow-200"
      : "bg-green-50 border-green-200"
  const statusText = isCritical
    ? "text-red-700"
    : isLow
      ? "text-yellow-700"
      : "text-green-700"
  const statusBadge = isCritical ? "danger" : isLow ? "warning" : "success"
  const statusLabel = isCritical ? "Critical" : isLow ? "Low Stock" : "OK"

  const displayRatio = Math.min(ratio, 1.5)
  const progressWidth = (displayRatio / 1.5) * 100

  return (
    <div
      className={`rounded-xl border p-5 transition-all hover:shadow-md ${statusBg}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isCritical
                ? "bg-red-100"
                : isLow
                  ? "bg-yellow-100"
                  : "bg-green-100"
            }`}
          >
            {isCritical ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : isLow ? (
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            ) : (
              <Package className="h-5 w-5 text-green-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground">{item.name}</h4>
            <p className="font-mono text-xs text-muted-foreground">
              {item.sku}
            </p>
          </div>
        </div>
        <Badge variant={statusBadge} className="capitalize">
          {statusLabel}
        </Badge>
      </div>

      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stock Level</span>
          <span className={`font-semibold ${statusText}`}>
            {item.stock} / {item.reorderPoint} {item.unit}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/80">
          <div
            className={`h-full rounded-full transition-all ${statusColor}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground capitalize">
          {type === "product" ? "Product" : "Raw Material"}
        </span>
        {isCritical || isLow ? (
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Reorder Now
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Healthy</span>
        )}
      </div>
    </div>
  )
}

export function InventoryOverviewPage() {
  const { products, rawMaterials } = useInventory()

  const productItems = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock: p.stockOnHand,
    reorderPoint: p.reorderPoint,
    unit: "pcs",
  }))

  const materialItems = rawMaterials.map((m) => ({
    id: m.id,
    name: m.name,
    sku: m.sku,
    stock: m.quantityAvailable,
    reorderPoint: m.reorderLevel,
    unit: m.unit,
  }))

  const allItems = [
    ...productItems.map((i) => ({ ...i, type: "product" as const })),
    ...materialItems.map((i) => ({ ...i, type: "material" as const })),
  ]

  const criticalCount = allItems.filter(
    (i) => i.stock / i.reorderPoint <= 0.5 || i.stock === 0
  ).length
  const lowCount = allItems.filter(
    (i) => i.stock / i.reorderPoint <= 1 && i.stock / i.reorderPoint > 0.5
  ).length
  const healthyCount = allItems.filter(
    (i) => i.stock / i.reorderPoint > 1
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Inventory Overview
          </h1>
          <p className="text-muted-foreground">Stock health at a glance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">
              Critical ({criticalCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">
              Low ({lowCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#00C853]" />
            <span className="text-sm text-muted-foreground">
              OK ({healthyCount})
            </span>
          </div>
        </div>
      </div>

      {criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Attention Required</p>
            <p className="text-sm text-red-700">
              {criticalCount} item{criticalCount > 1 ? "s" : ""} critically low
              on stock
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allItems.map((item) => (
          <InventoryCard
            key={`${item.type}-${item.id}`}
            item={item}
            type={item.type}
          />
        ))}
      </div>
    </div>
  )
}
