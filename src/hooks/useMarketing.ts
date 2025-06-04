import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Marketing = Tables<"marketing">
type MarketingInsert = TablesInsert<"marketing">
type MarketingUpdate = TablesUpdate<"marketing">

export const useMarketing = () => {
  return useQuery({
    queryKey: ["marketing"],
    queryFn: async (): Promise<Marketing[]> => {
      const { data: marketing, error } = await supabase
        .from("marketing")
        .select("*")
        .order("nome_cliente")

      if (error) throw error
      return marketing || []
    },
  })
}

export const useCreateMarketing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (marketing: MarketingInsert) => {
      const { data: newMarketing, error } = await supabase
        .from("marketing")
        .insert(marketing)
        .select()
        .single()

      if (error) throw error
      return newMarketing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing"] })
      toast.success("Contato de marketing cadastrado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao cadastrar contato de marketing:", error)
      toast.error("Erro ao cadastrar contato de marketing")
    },
  })
}

export const useUpdateMarketing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: MarketingUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("marketing")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing"] })
      toast.success("Contato de marketing atualizado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar contato de marketing:", error)
      toast.error("Erro ao atualizar contato de marketing")
    },
  })
}

export const useDeleteMarketing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketing")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing"] })
      toast.success("Contato de marketing excluído com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir contato de marketing:", error)
      toast.error("Erro ao excluir contato de marketing")
    },
  })
}
