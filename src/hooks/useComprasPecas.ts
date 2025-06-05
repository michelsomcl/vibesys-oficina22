
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

      // Buscar o nome do fornecedor
      const { data: fornecedor } = await supabase
        .from("fornecedores")
        .select("nome")
        .eq("id", compra.fornecedor_id)
        .single()

      // Buscar a categoria "Peças"
      const { data: categoria } = await supabase
        .from("categorias")
        .select("id")
        .eq("nome", "Peças")
        .eq("tipo", "despesa")
        .single()

      if (!categoria) {
        console.error("Categoria 'Peças' não encontrada")
        return data
      }

      // Verificar se já existe uma despesa para esta nota e fornecedor
      const { data: despesaExistente } = await supabase
        .from("despesas")
        .select("id, valor")
        .eq("categoria_id", categoria.id)
        .ilike("observacoes", `%${compra.numero_nota}%`)
        .ilike("observacoes", `%${fornecedor?.nome || ''}%`)
        .maybeSingle()

      const valorTotalCompra = compra.quantidade * compra.valor_custo
      const observacoes = `Fornecedor: ${fornecedor?.nome || 'N/A'} - Nota: ${compra.numero_nota}`

      if (despesaExistente) {
        // Atualizar despesa existente somando o valor
        const novoValor = Number(despesaExistente.valor) + valorTotalCompra
        
        await supabase
          .from("despesas")
          .update({ 
            valor: novoValor,
            updated_at: new Date().toISOString()
          })
          .eq("id", despesaExistente.id)
      } else {
        // Criar nova despesa
        await supabase
          .from("despesas")
          .insert({
            descricao: `Compra de Peças - Nota ${compra.numero_nota}`,
            valor: valorTotalCompra,
            data_vencimento: compra.data_compra || new Date().toISOString().split('T')[0],
            categoria_id: categoria.id,
            tipo: "Variável",
            observacoes: observacoes,
            status: "Pago",
            data_pagamento: compra.data_compra || new Date().toISOString().split('T')[0]
          })
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras_pecas"] })
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      queryClient.invalidateQueries({ queryKey: ["despesas"] })
      toast.success("Compra de peça registrada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao registrar compra de peça:", error)
      toast.error("Erro ao registrar compra de peça")
    },
  })
}
