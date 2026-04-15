import { useState, useMemo } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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
import {
  useGetAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts"
import { toast } from "@/components/toaster"

const ITEMS_PER_PAGE = 10

const formatNGN = (amount: number): string => {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`
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
      <TableCell>
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </TableCell>
    </TableRow>
  )
}

export function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAllProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<{
    id: string
    name: string
    sku: string
    category: string
    stock_on_hand: number
    reorder_point: number
    unit_price: number
  } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    stock_on_hand: 0,
    reorder_point: 0,
    unit_price: 0,
  })

  const categories = useMemo(() => {
    if (!products) return []
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))]
    return cats as string[]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = [...products]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    }

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

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }

    return filtered
  }, [products, searchQuery, statusFilter, categoryFilter])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku) return
    try {
      await createProduct.mutateAsync(formData as never)
      toast({
        title: "Product added",
        description: `${formData.name} has been added.`,
        type: "success",
      })
      setIsAddModalOpen(false)
      setFormData({
        name: "",
        sku: "",
        category: "",
        stock_on_hand: 0,
        reorder_point: 0,
        unit_price: 0,
      })
    } catch (error) {
      toast({ title: "Failed to add product", type: "error" })
    }
  }

  const handleEditSubmit = async () => {
    if (!editProduct || !editProduct.name || !editProduct.sku) return
    try {
      await updateProduct.mutateAsync(editProduct as never)
      toast({ title: "Product updated", type: "success" })
      setEditProduct(null)
    } catch (error) {
      toast({ title: "Failed to update product", type: "error" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProduct.mutateAsync(deleteId)
      toast({ title: "Product deleted", type: "info" })
      setDeleteId(null)
    } catch (error) {
      toast({ title: "Failed to delete product", type: "error" })
    }
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
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
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Reorder</TableHead>
              <TableHead className="text-right">Price</TableHead>
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
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    {product.stock_on_hand}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {product.reorder_point}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNGN(product.unit_price || 0)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      product.stock_on_hand,
                      product.reorder_point
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(product.id)}
                      >
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
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      No products found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ||
                      statusFilter !== "all" ||
                      categoryFilter !== "all"
                        ? "No products match your filters."
                        : "Add your first product to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum =
                  totalPages <= 5
                    ? i + 1
                    : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i
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

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details below</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="e.g., PROD-001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Rice & Grains">Rice & Grains</SelectItem>
                  <SelectItem value="Oil & Cooking">Oil & Cooking</SelectItem>
                  <SelectItem value="Canned Goods">Canned Goods</SelectItem>
                  <SelectItem value="Detergents">Detergents</SelectItem>
                  <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock On Hand</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_on_hand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_on_hand: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorder">Reorder Point</Label>
                <Input
                  id="reorder"
                  type="number"
                  value={formData.reorder_point}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reorder_point: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Unit Price (NGN)</Label>
              <Input
                id="price"
                type="number"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_price: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createProduct.isPending || !formData.name || !formData.sku
              }
            >
              {createProduct.isPending ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Product Name *</Label>
              <Input
                value={editProduct?.name || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct!, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>SKU *</Label>
              <Input
                value={editProduct?.sku || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct!, sku: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={editProduct?.category || ""}
                onValueChange={(v) =>
                  setEditProduct({ ...editProduct!, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stock On Hand</Label>
                <Input
                  type="number"
                  value={editProduct?.stock_on_hand || 0}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct!,
                      stock_on_hand: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Reorder Point</Label>
                <Input
                  type="number"
                  value={editProduct?.reorder_point || 0}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct!,
                      reorder_point: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Unit Price (NGN)</Label>
              <Input
                type="number"
                value={editProduct?.unit_price || 0}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct!,
                    unit_price: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={
                updateProduct.isPending ||
                !editProduct?.name ||
                !editProduct?.sku
              }
            >
              {updateProduct.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
