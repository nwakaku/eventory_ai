import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { QUERY_KEYS } from "@/lib/queryKeys"

const handleError = (error: Error) => {
  console.error(error.message)
  throw error
}

export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) handleError(error as Error)
      return data
    },
  })
}
