import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { QUERY_KEYS } from "@/lib/queryKeys"

const handleError = (error: Error) => {
  console.error(error.message)
  throw error
}

export const useGetAllSuppliers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUPPLIERS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) handleError(error as Error)
      return data
    },
  })
}

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (supplier: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert(supplier)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUPPLIERS] })
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...supplier }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update(supplier)
        .eq("id", id)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUPPLIERS] })
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("suppliers").delete().eq("id", id)
      if (error) handleError(error as Error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUPPLIERS] })
    },
  })
}
