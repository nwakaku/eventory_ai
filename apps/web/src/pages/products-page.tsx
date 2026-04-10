import { useState } from "react"
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts"
import { toast } from "@/components/toaster"

const categories = ["Pumps", "Valves", "Motors", "Controls", "Sensors", "Gauges", "Fittings", "Hydraulics", "Transmissions", "Thermal", "Pneumatics", "Filtration"]

interface ProductFormData {
  name: string
  sku: string
  category: string
  stock_on_hand: number
  reorder_point: number
  unit_price: number
}

function getStatusBadge(stockOnHand: number, reorderPoint: number) {
  let variant: "success" | "warning" | "danger"
  let label: string

  if (stockOnHand === 0) {
    variant = "danger"
    label = "Out of Stock"
  } else if (stockOnHand <= reorderPoint) {
    variant = "warning"
    label = "Low Stock"
  } else {
    variant = "success"
    label = "In Stock"
  }

  return <Badge variant={variant}>{label}</Badge>
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><div className="h-4 w-32 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-24 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-20 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-16 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-16 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-20 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-5 w-20 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-8 w-20 animate-pulse bg-muted rounded" /></TableCell>
    </TableRow>
  )
}

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAllProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductFormData & { id: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    stock_on_hand: 0,
    reorder_point: 0,
    unit_price: 0,
  })

  const openAddModal = () => {
    setFormData({ name: "", sku: "", category: "", stock_on_hand: 0, reorder_point: 0, unit_price: 0 })
    setIsAddModalOpen(true)
  }

  const openEditModal = (product: ProductFormData & { id: string }) => {
    setEditProduct(product)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku) return

    try {
      await createProduct.mutateAsync(formData)
      toast({ title: "Product added", description: `${formData.name} has been added.`, type: "success" })
      setIsAddModalOpen(false)
      setFormData({ name: "", sku: "", category: "", stock_on_hand: 0, reorder_point: 0, unit_price: 0 })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleEditSubmit = async () => {
    if (!editProduct || !editProduct.name || !editProduct.sku) return

    try {
      const { id, ...data } = editProduct
      await updateProduct.mutateAsync({ id, ...data })
      toast({ title: "Product updated", type: "success" })
      setEditProduct(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProduct.mutateAsync(deleteId)
      toast({ title: "Product deleted", type: "info" })
      setDeleteId(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load products.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock On Hand</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right font-medium">{product.stock_on_hand}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{product.reorder_point}</TableCell>
                  <TableCell className="text-right">${product.unit_price?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>{getStatusBadge(product.stock_on_hand, product.reorder_point)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">No products yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add your first product to get started.</p>
                    <Button onClick={openAddModal} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter the product details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g., PMP-001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock On Hand</Label>
                <Input id="stock" type="number" value={formData.stock_on_hand} onChange={e => setFormData({ ...formData, stock_on_hand: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorder">Reorder Point</Label>
                <Input id="reorder" type="number" value={formData.reorder_point} onChange={e => setFormData({ ...formData, reorder_point: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Unit Price ($)</Label>
              <Input id="price" type="number" step="0.01" value={formData.unit_price} onChange={e => setFormData({ ...formData, unit_price: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createProduct.isPending || !formData.name || !formData.sku}>
              {createProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input id="edit-name" value={editProduct?.name || ""} onChange={e => setEditProduct(prev => prev ? { ...prev, name: e.target.value } : null)} placeholder="Enter product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input id="edit-sku" value={editProduct?.sku || ""} onChange={e => setEditProduct(prev => prev ? { ...prev, sku: e.target.value } : null)} placeholder="e.g., PMP-001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editProduct?.category || ""} onValueChange={v => setEditProduct(prev => prev ? { ...prev, category: v } : null)}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock On Hand</Label>
                <Input id="edit-stock" type="number" value={editProduct?.stock_on_hand || 0} onChange={e => setEditProduct(prev => prev ? { ...prev, stock_on_hand: Number(e.target.value) } : null)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reorder">Reorder Point</Label>
                <Input id="edit-reorder" type="number" value={editProduct?.reorder_point || 0} onChange={e => setEditProduct(prev => prev ? { ...prev, reorder_point: Number(e.target.value) } : null)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Unit Price ($)</Label>
              <Input id="edit-price" type="number" step="0.01" value={editProduct?.unit_price || 0} onChange={e => setEditProduct(prev => prev ? { ...prev, unit_price: Number(e.target.value) } : null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={updateProduct.isPending || !editProduct?.name || !editProduct?.sku}>
              {updateProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this product? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
