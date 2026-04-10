import { useState, useMemo } from "react"
import { Plus, Send, Check, Truck, AlertTriangle, Sparkles, Loader2, ShoppingCart } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useGetAllPurchaseOrders, useCreatePurchaseOrder, useUpdatePurchaseOrder } from "@/hooks/usePurchaseOrders"
import { useGetAllProducts, useUpdateProduct } from "@/hooks/useProducts"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"
import { toast } from "@/components/toaster"

type POStatus = "draft" | "sent" | "received"

export function PurchaseOrdersPage() {
  const { data: purchaseOrders, isLoading: loadingPOs, isError: errorPOs } = useGetAllPurchaseOrders()
  const { data: products } = useGetAllProducts()
  const { data: suppliers } = useGetAllSuppliers()
  const createPurchaseOrder = useCreatePurchaseOrder()
  const updatePurchaseOrder = useUpdatePurchaseOrder()
  const updateProduct = useUpdateProduct()

  const [showAddModal, setShowAddModal] = useState(false)
  const [newOrder, setNewOrder] = useState({
    supplier_id: "",
    product_id: "",
    quantity: 100,
    cost_per_unit: 0,
    status: "draft" as POStatus,
  })

  const reorderSuggestions = useMemo(() => {
    if (!products) return []
    return products.filter(p => (p.stock_on_hand || 0) <= (p.reorder_point || 0))
  }, [products])

  const getStatusBadge = (status: POStatus) => {
    const variantMap: Record<POStatus, "secondary" | "warning" | "success"> = {
      draft: "secondary",
      sent: "warning",
      received: "success",
    }
    const labelMap: Record<POStatus, string> = {
      draft: "Draft",
      sent: "Sent",
      received: "Received",
    }
    return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
  }

  const getSupplierName = (supplierId: string) => {
    return suppliers?.find(s => s.id === supplierId)?.name || "-"
  }

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || "-"
  }

  const handleCreatePO = async () => {
    const product = products?.find(p => p.id === newOrder.product_id)
    if (!product || !newOrder.supplier_id) return

    try {
      await createPurchaseOrder.mutateAsync({
        supplier_id: newOrder.supplier_id,
        product_id: newOrder.product_id,
        quantity: newOrder.quantity,
        total: newOrder.quantity * newOrder.cost_per_unit,
        status: "draft",
      })
      toast({ title: "Purchase order created", description: `PO for ${product.name} has been created.`, type: "success" })
      setNewOrder({ supplier_id: "", product_id: "", quantity: 100, cost_per_unit: 0, status: "draft" })
      setShowAddModal(false)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleCreateFromSuggestion = async (product: { id: string; name: string; stock_on_hand: number; reorder_point: number; unit_price: number }) => {
    const suggestedQty = Math.max((product.reorder_point || 0) * 2 - (product.stock_on_hand || 0), (product.reorder_point || 0))
    const defaultSupplier = suppliers?.[0]?.id

    if (!defaultSupplier) {
      toast({ title: "Error", description: "No supplier available", type: "error" })
      return
    }

    try {
      await createPurchaseOrder.mutateAsync({
        supplier_id: defaultSupplier,
        product_id: product.id,
        quantity: suggestedQty,
        total: suggestedQty * (product.unit_price || 0),
        status: "draft",
      })
      toast({ title: "PO created", description: `PO for ${product.name} created with ${suggestedQty} units.`, type: "success" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleSend = async (order: { id: string }) => {
    try {
      await updatePurchaseOrder.mutateAsync({ id: order.id, status: "sent" })
      toast({ title: "PO sent", description: "Purchase order has been sent to supplier.", type: "info" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleReceive = async (order: { id: string; product_id: string; quantity: number }) => {
    const product = products?.find(p => p.id === order.product_id)
    if (!product) return

    try {
      await updatePurchaseOrder.mutateAsync({ id: order.id, status: "received" })
      await updateProduct.mutateAsync({
        id: order.product_id,
        stock_on_hand: (product.stock_on_hand || 0) + order.quantity,
      })
      toast({ title: "PO received", description: "Order received and stock updated.", type: "success" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = products?.find(p => p.id === productId)
    setNewOrder({
      ...newOrder,
      product_id: productId,
      cost_per_unit: product?.unit_price || 0,
    })
  }

  if (errorPOs) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load purchase orders.</p>
      </div>
    )
  }

  const draftCount = purchaseOrders?.filter(o => o.status === "draft").length || 0
  const sentCount = purchaseOrders?.filter(o => o.status === "sent").length || 0
  const receivedCount = purchaseOrders?.filter(o => o.status === "received").length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage supplier orders and inventory replenishment</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Create PO
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Supplier</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPOs ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : purchaseOrders && purchaseOrders.length > 0 ? purchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{getSupplierName(order.supplier_id)}</TableCell>
                    <TableCell>{getProductName(order.product_id)}</TableCell>
                    <TableCell className="text-right">{order.quantity}</TableCell>
                    <TableCell className="text-right font-medium">${(order.total || 0).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status as POStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {order.status === "draft" && (
                          <Button variant="ghost" size="icon-sm" onClick={() => handleSend(order)} title="Send PO">
                            <Send className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        {order.status === "sent" && (
                          <Button variant="ghost" size="icon-sm" onClick={() => handleReceive(order)} title="Mark as received">
                            <Truck className="h-4 w-4 text-[#00C853]" />
                          </Button>
                        )}
                        {order.status === "received" && (
                          <Check className="h-4 w-4 text-[#00C853]" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">No purchase orders yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Create your first purchase order.</p>
                        <Button onClick={() => setShowAddModal(true)} className="gap-2">
                          <Plus className="h-4 w-4" /> Create PO
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{draftCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-600">{sentCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Received</p>
              <p className="mt-1 text-2xl font-semibold text-[#00C853]">{receivedCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">AI Reorder Suggestions</h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Products below reorder threshold. Select items to create purchase orders automatically.
            </p>

            {reorderSuggestions.length > 0 ? (
              <div className="space-y-2">
                {reorderSuggestions.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: {product.stock_on_hand} / Min: {product.reorder_point}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleCreateFromSuggestion(product)}>
                      Create PO
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Check className="mb-2 h-8 w-8 text-[#00C853]" />
                <p className="text-sm text-muted-foreground">All products are well stocked!</p>
              </div>
            )}
          </div>

          {reorderSuggestions.length > 0 && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {reorderSuggestions.filter(p => (p.stock_on_hand || 0) <= ((p.reorder_point || 0) * 0.5)).length} critical
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for products.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={newOrder.supplier_id} onValueChange={v => setNewOrder({ ...newOrder, supplier_id: v })}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select value={newOrder.product_id} onValueChange={handleProductSelect}>
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
                <Label htmlFor="cost">Cost/Unit ($)</Label>
                <Input id="cost" type="number" step="0.01" value={newOrder.cost_per_unit} onChange={e => setNewOrder({ ...newOrder, cost_per_unit: Number(e.target.value) })} />
              </div>
            </div>
            {newOrder.quantity > 0 && newOrder.cost_per_unit > 0 && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-lg font-semibold text-foreground">
                  ${(newOrder.quantity * newOrder.cost_per_unit).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleCreatePO} disabled={!newOrder.supplier_id || !newOrder.product_id || createPurchaseOrder.isPending}>
              {createPurchaseOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create PO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
