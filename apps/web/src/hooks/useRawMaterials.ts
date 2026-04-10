import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { QUERY_KEYS } from "@/lib/queryKeys"

const handleError = (error: Error) => {
  console.error(error.message)
  throw error
}

export const useGetAllRawMaterials = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RAW_MATERIALS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("raw_materials")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) handleError(error as Error)
      return data
    },
  })
}

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (rawMaterial: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("raw_materials")
        .insert(rawMaterial)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RAW_MATERIALS] })
    },
  })
}

export const useUpdateRawMaterial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...rawMaterial }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("raw_materials")
        .update(rawMaterial)
        .eq("id", id)
        .select()
      if (error) handleError(error as Error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RAW_MATERIALS] })
    },
  })
}

export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("raw_materials").delete().eq("id", id)
      if (error) handleError(error as Error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RAW_MATERIALS] })
    },
  })
}
