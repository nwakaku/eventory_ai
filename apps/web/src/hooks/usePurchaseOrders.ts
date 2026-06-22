import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { QUERY_KEYS } from "@/lib/queryKeys"

const handleError = (error: Error) => {
  console.error(error.message)
  throw error
}

export const useGetAllPurchaseOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PURCHASE_ORDERS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) handleError(error as Error)
      return data
    },
  })
}

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (order: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .insert({
          supplier_id: order.supplier_id,
          product_id: order.product_id,
          quantity: order.quantity,
          status: "Pending",
        })
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PURCHASE_ORDERS] })
    },
  })
}

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...order
    }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .update(order)
        .eq("id", id)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PURCHASE_ORDERS] })
    },
  })
}

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("purchase_orders")
        .delete()
        .eq("id", id)
      if (error) handleError(error as Error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PURCHASE_ORDERS] })
    },
  })
}
