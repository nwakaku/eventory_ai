import { useState } from "react"
import { Plus, Check, Archive, Package, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
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
import { useGetAllSalesOrders, useCreateSalesOrder, useUpdateSalesOrder, useDeleteSalesOrder } from "@/hooks/useSalesOrders"
import { useGetAllProducts, useUpdateProduct } from "@/hooks/useProducts"
import { toast } from "@/components/toaster"

type OrderStatus = "Pending" | "Fulfilled" | "Archived"

export function SalesOrdersPage() {
  const { data: salesOrders, isLoading, isError } = useGetAllSalesOrders()
  const { data: products } = useGetAllProducts()
  const createSalesOrder = useCreateSalesOrder()
  const updateSalesOrder = useUpdateSalesOrder()
  const updateProduct = useUpdateProduct()

  const [showAddModal, setShowAddModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newOrder, setNewOrder] = useState({ customer: "", productId: "", quantity: 1 })

  const getStatusBadge = (status: string) => {
    const variantMap: Record<string, "warning" | "success" | "secondary"> = {
      "Pending": "warning",
      "Fulfilled": "success",
      "Archived": "secondary",
    }
    return <Badge variant={variantMap[status] || "secondary"}>{status}</Badge>
  }

  const filteredOrders = salesOrders?.filter(order => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  }) || []

  const handleAddOrder = async () => {
    const product = products?.find(p => p.id === newOrder.productId)
    if (!product || !newOrder.customer) return

    try {
      await createSalesOrder.mutateAsync({
        customer: newOrder.customer,
        product_id: newOrder.productId,
        quantity: newOrder.quantity,
        total: (product.unit_price || 0) * newOrder.quantity,
        status: "Pending",
      })
      toast({ title: "Order created", description: `Order for ${newOrder.customer} has been created.`, type: "success" })
      setNewOrder({ customer: "", productId: "", quantity: 1 })
      setShowAddModal(false)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleFulfill = async (order: { id: string; product_id: string; quantity: number }) => {
    const product = products?.find(p => p.id === order.product_id)
    if (!product) return

    const newStock = (product.stock_on_hand || 0) - order.quantity
    if (newStock < 0) {
      toast({ title: "Error", description: `Insufficient stock. Current: ${product.stock_on_hand}, Requested: ${order.quantity}`, type: "error" })
      return
    }

    try {
      await updateSalesOrder.mutateAsync({ id: order.id, status: "Fulfilled" })
      await updateProduct.mutateAsync({ id: order.product_id, stock_on_hand: newStock })
      toast({ title: "Order fulfilled", description: "Order has been marked as fulfilled and stock updated.", type: "success" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleArchive = async (orderId: string) => {
    try {
      await updateSalesOrder.mutateAsync({ id: orderId, status: "Archived" })
      toast({ title: "Order archived", type: "info" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const getProductName = (productId: string) => {
    return products?.find(p => p.id === productId)?.name || "-"
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load sales orders.</p>
      </div>
    )
  }

  const pendingOrders = salesOrders?.filter(o => o.status === "Pending") || []
  const fulfilledOrders = salesOrders?.filter(o => o.status === "Fulfilled") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{salesOrders?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600">{pendingOrders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Fulfilled</p>
          <p className="mt-1 text-2xl font-semibold text-[#00C853]">{fulfilledOrders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            ${fulfilledOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="Archived">Archived</TabsTrigger>
        </TabsList>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>{getProductName(order.product_id)}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right font-medium">${(order.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status || "Pending")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {order.status === "Pending" && (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleFulfill(order)} title="Fulfill order">
                          <Check className="h-4 w-4 text-[#00C853]" />
                        </Button>
                      )}
                      {order.status === "Fulfilled" && (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleArchive(order.id)} title="Archive order">
                          <Archive className="h-4 w-4 text-muted-foreground" />
                        </Button>
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
                      <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Create your first sales order.</p>
                      <Button onClick={() => setShowAddModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> Create Order
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sales Order</DialogTitle>
            <DialogDescription>Fill in the order details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" value={newOrder.customer} onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })} placeholder="Enter customer name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Select value={newOrder.productId} onValueChange={v => setNewOrder({ ...newOrder, productId: v })}>
                  <SelectTrigger id="product"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (${p.unit_price})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input id="qty" type="number" min="1" value={newOrder.quantity} onChange={e => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })} />
              </div>
            </div>
            {newOrder.productId && newOrder.quantity > 0 && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-lg font-semibold text-foreground">
                  ${((products?.find(p => p.id === newOrder.productId)?.unit_price || 0) * newOrder.quantity).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddOrder} disabled={!newOrder.customer || !newOrder.productId || createSalesOrder.isPending}>
              {createSalesOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
