
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Despesa = Tables<"despesas">
type DespesaInsert = TablesInsert<"despesas">
type DespesaUpdate = TablesUpdate<"despesas">

export const useDespesas = () => {
  return useQuery({
    queryKey: ["despesas"],
    queryFn: async (): Promise<Despesa[]> => {
      const { data, error } = await supabase
        .from("despesas")
        .select(`
          *,
          categoria:categorias(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },
  })
}

export const useCreateDespesa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (despesa: DespesaInsert) => {
      const { data, error } = await supabase
        .from("despesas")
        .insert(despesa)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] })
      toast.success("Despesa criada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar despesa:", error)
      toast.error("Erro ao criar despesa")
    },
  })
}

export const useUpdateDespesa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: DespesaUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("despesas")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] })
      toast.success("Despesa atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar despesa:", error)
      toast.error("Erro ao atualizar despesa")
    },
  })
}

export const useDeleteDespesa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("despesas")
        .delete()
        .eq("id", id)

      if (error) throw error
      return { deletedId: id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] })
      toast.success("Despesa excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir despesa:", error)
      toast.error("Erro ao excluir despesa")
    },
  })
}
