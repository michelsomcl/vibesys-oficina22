
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Receita = Tables<"receitas">
type ReceitaInsert = TablesInsert<"receitas">
type ReceitaUpdate = TablesUpdate<"receitas">

export const useReceitas = () => {
  return useQuery({
    queryKey: ["receitas"],
    queryFn: async (): Promise<Receita[]> => {
      const { data, error } = await supabase
        .from("receitas")
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

export const useCreateReceita = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (receita: ReceitaInsert) => {
      const { data, error } = await supabase
        .from("receitas")
        .insert(receita)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] })
      toast.success("Receita criada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar receita:", error)
      toast.error("Erro ao criar receita")
    },
  })
}

export const useUpdateReceita = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ReceitaUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("receitas")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] })
      toast.success("Receita atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar receita:", error)
      toast.error("Erro ao atualizar receita")
    },
  })
}

export const useDeleteReceita = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("receitas")
        .delete()
        .eq("id", id)

      if (error) throw error
      return { deletedId: id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] })
      toast.success("Receita excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir receita:", error)
      toast.error("Erro ao excluir receita")
    },
  })
}
