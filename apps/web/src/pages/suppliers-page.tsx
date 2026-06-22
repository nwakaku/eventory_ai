import { useState } from "react"
import {
  Plus,
  Mail,
  Phone,
  Clock,
  Package,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
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
import { toast } from "@/components/toaster"
import {
  useGetAllSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/useSuppliers"

type SupplierFormData = {
  name: string
  email: string
  phone: string
  lead_time_days: number
}

export function SuppliersPage() {
  const { data: suppliers, isLoading } = useGetAllSuppliers()
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<
    (SupplierFormData & { id: string }) | null
  >(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    email: "",
    phone: "",
    lead_time_days: 7,
  })

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", lead_time_days: 7 })
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      toast({ title: "Please fill required fields", type: "error" })
      return
    }
    try {
      await createSupplier.mutateAsync(formData)
      toast({ title: "Supplier added successfully", type: "success" })
      setIsAddModalOpen(false)
      resetForm()
    } catch (error) {
      toast({ title: "Failed to add supplier", type: "error" })
    }
  }

  const handleEdit = async () => {
    if (!editingSupplier) return
    try {
      await updateSupplier.mutateAsync({ id: editingSupplier.id, ...formData })
      toast({ title: "Supplier updated successfully", type: "success" })
      setEditingSupplier(null)
      resetForm()
    } catch (error) {
      toast({ title: "Failed to update supplier", type: "error" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSupplier.mutateAsync(deleteId)
      toast({ title: "Supplier deleted successfully", type: "success" })
      setDeleteId(null)
    } catch (error) {
      toast({ title: "Failed to delete supplier", type: "error" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage your product suppliers</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <p className="text-2xl font-semibold text-foreground">
                {suppliers?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Lead Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suppliers?.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        {supplier.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {supplier.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {supplier.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {supplier.lead_time_days || 0} days
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSupplier({
                            id: supplier.id,
                            name: supplier.name,
                            email: supplier.email,
                            phone: supplier.phone || "",
                            lead_time_days: supplier.lead_time_days || 7,
                          })
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!suppliers || suppliers.length === 0) && (
          <div className="p-12 text-center text-muted-foreground">
            No suppliers found. Add your first supplier.
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Enter supplier details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="08012345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                value={formData.lead_time_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lead_time_days: parseInt(e.target.value) || 7,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={createSupplier.isPending}>
              {createSupplier.isPending ? "Adding..." : "Add Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={!!editingSupplier}
        onOpenChange={() => setEditingSupplier(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editingSupplier?.name || ""}
                onChange={(e) =>
                  setEditingSupplier({
                    ...editingSupplier!,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingSupplier?.email || ""}
                onChange={(e) =>
                  setEditingSupplier({
                    ...editingSupplier!,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editingSupplier?.phone || ""}
                onChange={(e) =>
                  setEditingSupplier({
                    ...editingSupplier!,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-leadTime">Lead Time (days)</Label>
              <Input
                id="edit-leadTime"
                type="number"
                value={editingSupplier?.lead_time_days || 7}
                onChange={(e) =>
                  setEditingSupplier({
                    ...editingSupplier!,
                    lead_time_days: parseInt(e.target.value) || 7,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSupplier(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateSupplier.isPending}>
              {updateSupplier.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supplier? This action cannot
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
