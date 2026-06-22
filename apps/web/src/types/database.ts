export type Supplier = {
  id: string
  name: string
  email: string
  phone: string | null
  lead_time_days: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  sku: string
  category: string | null
  stock_on_hand: number
  reorder_point: number
  unit_price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  created_at: string
}

export type RawMaterial = {
  id: string
  name: string
  sku: string | null
  unit: string
  quantity_available: number
  reorder_level: number
  cost_per_unit: number
  supplier_id: string | null
  supplier?: Supplier
  created_at: string
}

export type ProductionOrder = {
  id: string
  product_id: string
  product?: { name: string }
  quantity: number
  status: "Planned" | "In Progress" | "Completed"
  completion_percent: number
  created_at: string
}

export type SalesOrder = {
  id: string
  customer: string
  product_id: string
  product?: { name: string }
  quantity: number
  total: number
  status: "Pending" | "Fulfilled" | "Archived"
  created_at: string
}

export type PurchaseOrder = {
  id: string
  supplier_id: string
  supplier?: Supplier
  quantity: number
  status: "Draft" | "Sent" | "Received"
  created_at: string
}
