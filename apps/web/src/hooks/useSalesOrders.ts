import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { QUERY_KEYS } from "@/lib/queryKeys"

const handleError = (error: Error) => {
  console.error(error.message)
  throw error
}

export const useGetAllSalesOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SALES_ORDERS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_orders")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) handleError(error as Error)
      return data
    },
  })
}

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (order: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("sales_orders")
        .insert(order)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_ORDERS] })
    },
  })
}

export const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...order }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("sales_orders")
        .update(order)
        .eq("id", id)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_ORDERS] })
    },
  })
}

export const useDeleteSalesOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sales_orders").delete().eq("id", id)
      if (error) handleError(error as Error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_ORDERS] })
    },
  })
}
