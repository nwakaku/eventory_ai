import { useState } from "react"
import { Plus, Package, ArrowRight, Loader2, Pencil } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { useGetAllProductionOrders, useCreateProductionOrder, useUpdateProductionOrder, useDeleteProductionOrder } from "@/hooks/useProductionOrders"
import { useGetAllProducts } from "@/hooks/useProducts"
import { toast } from "@/components/toaster"

const columns: { id: string; title: string; color: string }[] = [
  { id: "Planned", title: "Planned", color: "bg-slate-500" },
  { id: "In Progress", title: "In Progress", color: "bg-primary" },
  { id: "Completed", title: "Completed", color: "bg-[#00C853]" },
]

function ProductionCard({ order, onClick }: { order: { id: string; product_id: string; quantity: number; completion_percent: number; status: string }; onClick: () => void }) {
  const currentIndex = columns.findIndex(c => c.id === order.status)
  const canMovePrev = currentIndex > 0
  const canMoveNext = currentIndex < columns.length - 1

  return (
    <div 
      className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground text-sm">{order.product_id}</span>
        </div>
        <span className="text-sm font-semibold text-primary">{order.quantity} units</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{order.completion_percent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full transition-all ${order.status === "Completed" ? "bg-[#00C853]" : "bg-primary"}`} style={{ width: `${order.completion_percent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
        <div className="flex items-center gap-1">
          {canMovePrev && (
            <Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); onClick() }}>
              <ArrowRight className="h-3 w-3 rotate-180" />
            </Button>
          )}
          {canMoveNext && (
            <Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); onClick() }}>
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProductionPage() {
  const { data: productionOrders, isLoading, isError } = useGetAllProductionOrders()
  const { data: products } = useGetAllProducts()
  const createProductionOrder = useCreateProductionOrder()
  const updateProductionOrder = useUpdateProductionOrder()
  const deleteProductionOrder = useDeleteProductionOrder()

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; product_id: string; quantity: number; completion_percent: number; status: string } | null>(null)
  const [newOrder, setNewOrder] = useState({ product_id: "", quantity: 100, completion_percent: 0 })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || "-"
  }

  const handleCreate = async () => {
    if (!newOrder.product_id) return

    try {
      await createProductionOrder.mutateAsync({
        product_id: newOrder.product_id,
        quantity: newOrder.quantity,
        completion_percent: newOrder.completion_percent,
        status: "Planned",
      })
      toast({ title: "Production order created", type: "success" })
      setNewOrder({ product_id: "", quantity: 100, completion_percent: 0 })
      setShowAddModal(false)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleMoveStatus = async (orderId: string, direction: "prev" | "next") => {
    const order = productionOrders?.find(o => o.id === orderId)
    if (!order) return
    const currentIndex = columns.findIndex(c => c.id === order.status)
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < columns.length) {
      try {
        await updateProductionOrder.mutateAsync({ id: orderId, status: columns[newIndex].id })
        toast({ title: `Order moved to ${columns[newIndex].title}`, type: "info" })
      } catch (error) {
        // Error handled by global mutation handler
      }
    }
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return

    try {
      await updateProductionOrder.mutateAsync({
        id: selectedOrder.id,
        product_id: selectedOrder.product_id,
        quantity: selectedOrder.quantity,
        completion_percent: selectedOrder.completion_percent,
        status: selectedOrder.status,
      })
      toast({ title: "Order updated", type: "success" })
      setSelectedOrder(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProductionOrder.mutateAsync(deleteId)
      toast({ title: "Order deleted", type: "info" })
      setDeleteId(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load production orders.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Production</h1>
          <p className="text-muted-foreground">Manage production orders</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const orders = productionOrders?.filter(o => o.status === column.id) || []
            return (
              <div key={column.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-3 w-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary">{orders.length}</Badge>
                </div>
                <div className="flex-1 space-y-3 min-h-[500px]">
                  {orders.map((order) => (
                    <ProductionCard 
                      key={order.id} 
                      order={order} 
                      onClick={() => setSelectedOrder(order)}
                    />
                  ))}
                  {orders.length === 0 && (
                    <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-border text-muted-foreground text-sm">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-medium text-foreground mb-3">Quick Stats</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{productionOrders?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{productionOrders?.filter(o => o.status === "In Progress").length || 0}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-[#00C853]">{productionOrders?.filter(o => o.status === "Completed").length || 0}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-500">{productionOrders?.filter(o => o.status === "Planned").length || 0}</p>
            <p className="text-sm text-muted-foreground">Planned</p>
          </div>
        </div>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Production Order</DialogTitle>
            <DialogDescription>Create a new production order.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select value={newOrder.product_id} onValueChange={v => setNewOrder({ ...newOrder, product_id: v })}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input id="qty" type="number" min="1" value={newOrder.quantity} onChange={e => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress %</Label>
                <Input id="progress" type="number" min="0" max="100" value={newOrder.completion_percent} onChange={e => setNewOrder({ ...newOrder, completion_percent: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newOrder.product_id || createProductionOrder.isPending}>
              {createProductionOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Production Order</DialogTitle>
            <DialogDescription>Update order details or change status.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Product</Label>
                <p className="text-sm font-medium">{getProductName(selectedOrder.product_id)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-qty">Quantity</Label>
                  <Input id="edit-qty" type="number" min="1" value={selectedOrder.quantity} onChange={e => setSelectedOrder({ ...selectedOrder, quantity: Number(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-progress">Progress %</Label>
                  <Input id="edit-progress" type="number" min="0" max="100" value={selectedOrder.completion_percent} onChange={e => setSelectedOrder({ ...selectedOrder, completion_percent: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={selectedOrder.status} onValueChange={v => setSelectedOrder({ ...selectedOrder, status: v })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => { setDeleteId(selectedOrder?.id || null); setSelectedOrder(null) }}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Cancel</Button>
              <Button onClick={handleUpdateOrder} disabled={updateProductionOrder.isPending}>
                {updateProductionOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
