import { useState } from "react"
import { Plus, Mail, Phone, Clock, Package, Pencil, Trash2 } from "lucide-react"
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

type Supplier = {
  id: number
  name: string
  contactName: string
  email: string
  phone: string
  leadTimeDays: number
  linkedProducts: string[]
}

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Steel Co Ltd",
    contactName: "James Wilson",
    email: "james@steelco.com",
    phone: "+1 555-0123",
    leadTimeDays: 7,
    linkedProducts: ["Industrial Pump A200", "Motor Unit M-100"],
  },
  {
    id: 2,
    name: "Aluminum Inc",
    contactName: "Sarah Chen",
    email: "sarah@aluminum.com",
    phone: "+1 555-0124",
    leadTimeDays: 5,
    linkedProducts: ["Control Panel CP-7", "Valve Assembly V50"],
  },
  {
    id: 3,
    name: "Copper World",
    contactName: "Mike Brown",
    email: "mike@copperworld.com",
    phone: "+1 555-0125",
    leadTimeDays: 10,
    linkedProducts: ["Sensor Array S-25"],
  },
  {
    id: 4,
    name: "Plastics Direct",
    contactName: "Lisa Wang",
    email: "lisa@plastics.com",
    phone: "+1 555-0126",
    leadTimeDays: 3,
    linkedProducts: ["Valve Assembly V50"],
  },
  {
    id: 5,
    name: "Rubber Solutions",
    contactName: "Tom Davis",
    email: "tom@rubbersol.com",
    phone: "+1 555-0127",
    leadTimeDays: 4,
    linkedProducts: ["Industrial Pump A200", "Valve Assembly V50"],
  },
]

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    leadTimeDays: 7,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      contactName: "",
      email: "",
      phone: "",
      leadTimeDays: 7,
    })
  }

  const handleAddSupplier = () => {
    const supplier: Supplier = {
      id: Date.now(),
      ...formData,
      linkedProducts: [],
    }
    setSuppliers([...suppliers, supplier])
    toast({
      title: "Supplier added",
      description: `${formData.name} has been added.`,
      type: "success",
    })
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleUpdateSupplier = () => {
    if (!editingSupplier) return
    setSuppliers(
      suppliers.map((s) =>
        s.id === editingSupplier.id ? { ...s, ...formData } : s
      )
    )
    toast({
      title: "Supplier updated",
      description: `${formData.name} has been updated.`,
      type: "success",
    })
    setEditingSupplier(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!deleteId) return
    const supplier = suppliers.find((s) => s.id === deleteId)
    setSuppliers(suppliers.filter((s) => s.id !== deleteId))
    toast({
      title: "Supplier deleted",
      description: `${supplier?.name} has been deleted.`,
      type: "info",
    })
    setDeleteId(null)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      leadTimeDays: supplier.leadTimeDays,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {supplier.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {supplier.contactName}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEditModal(supplier)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteId(supplier.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{supplier.leadTimeDays} days lead time</span>
              </div>
            </div>

            {supplier.linkedProducts.length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Supplies:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.linkedProducts.map((product) => (
                    <span
                      key={product}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      <Package className="h-3 w-3" />
                      {product.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {suppliers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              No suppliers yet
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add your first supplier to get started.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>
              Enter the supplier details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sup-name">Company Name</Label>
              <Input
                id="sup-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Name</Label>
              <Input
                id="contact"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Enter contact name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 555-0000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-time">Lead Time (days)</Label>
              <Input
                id="lead-time"
                type="number"
                value={formData.leadTimeDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadTimeDays: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSupplier}
              disabled={!formData.name || !formData.email}
            >
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingSupplier}
        onOpenChange={() => {
          setEditingSupplier(null)
          resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Company Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact Name</Label>
              <Input
                id="edit-contact"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-lead-time">Lead Time (days)</Label>
              <Input
                id="edit-lead-time"
                type="number"
                value={formData.leadTimeDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadTimeDays: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingSupplier(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSupplier}
              disabled={!formData.name || !formData.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
