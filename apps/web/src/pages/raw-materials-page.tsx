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
import { useGetAllRawMaterials, useCreateRawMaterial, useUpdateRawMaterial, useDeleteRawMaterial } from "@/hooks/useRawMaterials"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"
import { toast } from "@/components/toaster"

const units = ["kg", "m", "L", "pcs", "rolls"]

interface RawMaterialFormData {
  name: string
  sku: string
  unit: string
  quantity_available: number
  reorder_level: number
  cost_per_unit: number
  supplier_id: string
}

function getStatusBadge(quantityAvailable: number, reorderLevel: number) {
  let variant: "success" | "warning" | "danger"
  let label: string

  if (quantityAvailable === 0) {
    variant = "danger"
    label = "Out of Stock"
  } else if (quantityAvailable <= reorderLevel) {
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
      <TableCell><div className="h-4 w-16 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-16 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-16 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-28 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-4 w-20 ml-auto animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-5 w-20 animate-pulse bg-muted rounded" /></TableCell>
      <TableCell><div className="h-8 w-20 animate-pulse bg-muted rounded" /></TableCell>
    </TableRow>
  )
}

export function RawMaterialsPage() {
  const { data: rawMaterials, isLoading, isError } = useGetAllRawMaterials()
  const { data: suppliers } = useGetAllSuppliers()
  const createRawMaterial = useCreateRawMaterial()
  const updateRawMaterial = useUpdateRawMaterial()
  const deleteRawMaterial = useDeleteRawMaterial()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editMaterial, setEditMaterial] = useState<RawMaterialFormData & { id: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<RawMaterialFormData>({
    name: "",
    sku: "",
    unit: "",
    quantity_available: 0,
    reorder_level: 0,
    cost_per_unit: 0,
    supplier_id: "",
  })

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers?.find(s => s.id === supplierId)
    return supplier?.name || "-"
  }

  const openAddModal = () => {
    setFormData({ name: "", sku: "", unit: "", quantity_available: 0, reorder_level: 0, cost_per_unit: 0, supplier_id: "" })
    setIsAddModalOpen(true)
  }

  const openEditModal = (material: RawMaterialFormData & { id: string }) => {
    setEditMaterial(material)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.unit) return

    try {
      await createRawMaterial.mutateAsync({
        name: formData.name,
        sku: formData.sku || null,
        unit: formData.unit,
        quantity_available: formData.quantity_available,
        reorder_level: formData.reorder_level,
        cost_per_unit: formData.cost_per_unit,
        supplier_id: formData.supplier_id || null,
      })
      toast({ title: "Material added", description: `${formData.name} has been added.`, type: "success" })
      setIsAddModalOpen(false)
      setFormData({ name: "", sku: "", unit: "", quantity_available: 0, reorder_level: 0, cost_per_unit: 0, supplier_id: "" })
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleEditSubmit = async () => {
    if (!editMaterial || !editMaterial.name || !editMaterial.unit) return

    try {
      const { id, ...data } = editMaterial
      await updateRawMaterial.mutateAsync({
        id,
        ...data,
        supplier_id: data.supplier_id || null,
      })
      toast({ title: "Material updated", type: "success" })
      setEditMaterial(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteRawMaterial.mutateAsync(deleteId)
      toast({ title: "Material deleted", type: "info" })
      setDeleteId(null)
    } catch (error) {
      // Error handled by global mutation handler
    }
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Failed to load raw materials.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Raw Materials</h1>
          <p className="text-muted-foreground">Track and manage raw material inventory</p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Material
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="hidden overflow-x-auto sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Material Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Quantity Available</TableHead>
                <TableHead className="text-right">Reorder Level</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Cost/Unit</TableHead>
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
              ) : rawMaterials && rawMaterials.length > 0 ? (
                rawMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell className="font-mono text-muted-foreground text-sm">{material.sku || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{material.unit}</TableCell>
                    <TableCell className="text-right font-medium">{material.quantity_available}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{material.reorder_level}</TableCell>
                    <TableCell>
                      <span className="text-sm">{getSupplierName(material.supplier_id)}</span>
                    </TableCell>
                    <TableCell className="text-right">${material.cost_per_unit?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>{getStatusBadge(material.quantity_available, material.reorder_level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(material)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(material.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-muted p-4 mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">No materials yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Add your first raw material to get started.</p>
                      <Button onClick={openAddModal} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Material
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="divide-y divide-border sm:hidden">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3 p-4">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </>
          ) : rawMaterials && rawMaterials.length > 0 ? (
            rawMaterials.map((material) => (
              <div key={material.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{material.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{material.sku || "-"}</p>
                  </div>
                  {getStatusBadge(material.quantity_available, material.reorder_level)}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <div>
                    <span className="text-muted-foreground">Unit: </span>
                    <span>{material.unit}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Qty: </span>
                    <span className="font-medium">{material.quantity_available}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reorder: </span>
                    <span>{material.reorder_level}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost/Unit: </span>
                    <span>${material.cost_per_unit?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Supplier: </span>
                    <span>{getSupplierName(material.supplier_id)}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(material)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(material.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No materials yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first raw material to get started.</p>
              <Button onClick={openAddModal} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Raw Material</DialogTitle>
            <DialogDescription>Enter the material details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mat-name">Material Name</Label>
              <Input id="mat-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter material name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mat-unit">Unit</Label>
                <Select value={formData.unit} onValueChange={v => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger id="mat-unit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mat-supplier">Supplier</Label>
                <Select value={formData.supplier_id} onValueChange={v => setFormData({ ...formData, supplier_id: v })}>
                  <SelectTrigger id="mat-supplier"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mat-qty">Quantity Available</Label>
                <Input id="mat-qty" type="number" value={formData.quantity_available} onChange={e => setFormData({ ...formData, quantity_available: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mat-reorder">Reorder Level</Label>
                <Input id="mat-reorder" type="number" value={formData.reorder_level} onChange={e => setFormData({ ...formData, reorder_level: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mat-cost">Cost/Unit ($)</Label>
              <Input id="mat-cost" type="number" step="0.01" value={formData.cost_per_unit} onChange={e => setFormData({ ...formData, cost_per_unit: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createRawMaterial.isPending || !formData.name || !formData.unit}>
              {createRawMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editMaterial} onOpenChange={() => setEditMaterial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Raw Material</DialogTitle>
            <DialogDescription>Update the material details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-mat-name">Material Name</Label>
              <Input id="edit-mat-name" value={editMaterial?.name || ""} onChange={e => setEditMaterial(prev => prev ? { ...prev, name: e.target.value } : null)} placeholder="Enter material name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-mat-unit">Unit</Label>
                <Select value={editMaterial?.unit || ""} onValueChange={v => setEditMaterial(prev => prev ? { ...prev, unit: v } : null)}>
                  <SelectTrigger id="edit-mat-unit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mat-supplier">Supplier</Label>
                <Select value={editMaterial?.supplier_id || ""} onValueChange={v => setEditMaterial(prev => prev ? { ...prev, supplier_id: v } : null)}>
                  <SelectTrigger id="edit-mat-supplier"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-mat-qty">Quantity Available</Label>
                <Input id="edit-mat-qty" type="number" value={editMaterial?.quantity_available || 0} onChange={e => setEditMaterial(prev => prev ? { ...prev, quantity_available: Number(e.target.value) } : null)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mat-reorder">Reorder Level</Label>
                <Input id="edit-mat-reorder" type="number" value={editMaterial?.reorder_level || 0} onChange={e => setEditMaterial(prev => prev ? { ...prev, reorder_level: Number(e.target.value) } : null)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mat-cost">Cost/Unit ($)</Label>
              <Input id="edit-mat-cost" type="number" step="0.01" value={editMaterial?.cost_per_unit || 0} onChange={e => setEditMaterial(prev => prev ? { ...prev, cost_per_unit: Number(e.target.value) } : null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMaterial(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={updateRawMaterial.isPending || !editMaterial?.name || !editMaterial?.unit}>
              {updateRawMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this material? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteRawMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
