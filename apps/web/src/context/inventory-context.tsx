import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { Supplier } from "@/types/database"

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  stock_on_hand: number
  reorder_point: number
  unit_price: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  created_at: string
}

export type RawMaterial = {
  id: string
  name: string
  sku: string
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
  product?: Product
  quantity: number
  status: "Planned" | "In Progress" | "Completed"
  completion_percent: number
  created_at: string
}

export type SalesOrder = {
  id: string
  customer: string
  product_id: string
  product?: Product
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

type InventoryContextType = {
  products: Product[]
  rawMaterials: RawMaterial[]
  suppliers: Supplier[]
  productionOrders: ProductionOrder[]
  salesOrders: SalesOrder[]
  purchaseOrders: PurchaseOrder[]
  loading: boolean
  refreshData: () => Promise<void>
  addSalesOrder: (order: Omit<SalesOrder, "id" | "created_at" | "product">) => Promise<void>
  fulfillSalesOrder: (orderId: string) => Promise<void>
  archiveSalesOrder: (orderId: string) => Promise<void>
  addPurchaseOrder: (order: Omit<PurchaseOrder, "id" | "created_at" | "supplier">) => Promise<void>
  updatePurchaseOrderStatus: (orderId: string, status: PurchaseOrder["status"]) => Promise<void>
  updateProductionStatus: (orderId: string, status: ProductionOrder["status"]) => Promise<void>
}

const InventoryContext = createContext<InventoryContextType | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([])
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)

      const [productsRes, materialsRes, suppliersRes, productionRes, salesRes, purchaseRes] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("raw_materials").select("*, supplier:suppliers(name)").order("name"),
        supabase.from("suppliers").select("*").order("name"),
        supabase.from("production_orders").select("*, product:products(name)").order("created_at", { ascending: false }),
        supabase.from("sales_orders").select("*, product:products(name)").order("created_at", { ascending: false }),
        supabase.from("purchase_orders").select("*, supplier:suppliers(name)").order("created_at", { ascending: false }),
      ])

      if (productsRes.data) setProducts(productsRes.data)
      if (materialsRes.data) setRawMaterials(materialsRes.data)
      if (suppliersRes.data) setSuppliers(suppliersRes.data)
      if (productionRes.data) setProductionOrders(productionRes.data)
      if (salesRes.data) setSalesOrders(salesRes.data)
      if (purchaseRes.data) setPurchaseOrders(purchaseRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addSalesOrder = async (order: Omit<SalesOrder, "id" | "created_at" | "product">) => {
    const { data, error } = await supabase
      .from("sales_orders")
      .insert([order])
      .select()
      .single()

    if (error) throw error
    if (data) {
      setSalesOrders(prev => [data, ...prev])
      
      const product = products.find(p => p.id === order.product_id)
      if (product) {
        await supabase
          .from("products")
          .update({ stock_on_hand: product.stock_on_hand - order.quantity })
          .eq("id", order.product_id)
        setProducts(prev => prev.map(p => 
          p.id === order.product_id 
            ? { ...p, stock_on_hand: p.stock_on_hand - order.quantity }
            : p
        ))
      }
    }
  }

  const fulfillSalesOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("sales_orders")
      .update({ status: "Fulfilled" })
      .eq("id", orderId)

    if (error) throw error
    setSalesOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: "Fulfilled" } : o
    ))
  }

  const archiveSalesOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("sales_orders")
      .update({ status: "Archived" })
      .eq("id", orderId)

    if (error) throw error
    setSalesOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: "Archived" } : o
    ))
  }

  const addPurchaseOrder = async (order: Omit<PurchaseOrder, "id" | "created_at" | "supplier">) => {
    const { data, error } = await supabase
      .from("purchase_orders")
      .insert([order])
      .select()
      .single()

    if (error) throw error
    if (data) {
      setPurchaseOrders(prev => [data, ...prev])
    }
  }

  const updatePurchaseOrderStatus = async (orderId: string, status: PurchaseOrder["status"]) => {
    const { error } = await supabase
      .from("purchase_orders")
      .update({ status })
      .eq("id", orderId)

    if (error) throw error
    setPurchaseOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status } : o
    ))
  }

  const updateProductionStatus = async (orderId: string, status: ProductionOrder["status"]) => {
    const completionPercent = status === "Completed" ? 100 : status === "In Progress" ? 50 : 0
    
    const { error } = await supabase
      .from("production_orders")
      .update({ status, completion_percent: completionPercent })
      .eq("id", orderId)

    if (error) throw error
    setProductionOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status, completion_percent: completionPercent } : o
    ))
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        rawMaterials,
        suppliers,
        productionOrders,
        salesOrders,
        purchaseOrders,
        loading,
        refreshData: fetchData,
        addSalesOrder,
        fulfillSalesOrder,
        archiveSalesOrder,
        addPurchaseOrder,
        updatePurchaseOrderStatus,
        updateProductionStatus,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider")
  }
  return context
}
