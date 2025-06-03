
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"
import { toast } from "sonner"

type Categoria = Tables<"categorias">
type CategoriaInsert = TablesInsert<"categorias">
type CategoriaUpdate = TablesUpdate<"categorias">

export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async (): Promise<Categoria[]> => {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nome")

      if (error) throw error
      return data || []
    },
  })
}

export const useCreateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoria: CategoriaInsert) => {
      const { data, error } = await supabase
        .from("categorias")
        .insert(categoria)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      toast.success("Categoria criada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error)
      toast.error("Erro ao criar categoria")
    },
  })
}

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: CategoriaUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("categorias")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      toast.success("Categoria atualizada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao atualizar categoria:", error)
      toast.error("Erro ao atualizar categoria")
    },
  })
}

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", id)

      if (error) throw error
      return { deletedId: id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] })
      toast.success("Categoria excluída com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao excluir categoria:", error)
      toast.error("Erro ao excluir categoria")
    },
  })
}
