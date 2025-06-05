
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CompraPeca {
  id: string
  numero_nota: string
  fornecedor_id: string
  peca_id: string
  quantidade: number
  valor_custo: number
  data_compra: string
  created_at: string
  updated_at: string
}

interface CompraPecaInsert {
  numero_nota: string
  fornecedor_id: string
  peca_id: string
  quantidade: number
  valor_custo: number
  data_compra?: string
}

export const useComprasPecas = () => {
  return useQuery({
    queryKey: ["compras_pecas"],
    queryFn: async (): Promise<CompraPeca[]> => {
      const { data, error } = await supabase
        .from("compras_pecas")
        .select(`
          *,
          fornecedores(nome),
          pecas(nome)
        `)
        .order("data_compra", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export const useCreateCompraPeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (compra: CompraPecaInsert) => {
      const { data, error } = await supabase
        .from("compras_pecas")
        .insert(compra)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras_pecas"] })
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      toast.success("Compra de peça registrada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao registrar compra de peça:", error)
      toast.error("Erro ao registrar compra de peça")
    },
  })
}
