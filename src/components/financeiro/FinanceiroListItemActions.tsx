
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Tables } from "@/integrations/supabase/types"
import { useUpdateReceita, useDeleteReceita } from "@/hooks/useReceitas"
import { useUpdateDespesa, useDeleteDespesa } from "@/hooks/useDespesas"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroListItemActionsProps {
  item: Receita | Despesa
  tipo: "receita" | "despesa"
  statusReal: string
  isReceitaOS: boolean
}

export const FinanceiroListItemActions = ({
  item,
  tipo,
  statusReal,
  isReceitaOS
}: FinanceiroListItemActionsProps) => {
  const updateReceita = useUpdateReceita()
  const deleteReceita = useDeleteReceita()
  const updateDespesa = useUpdateDespesa()
  const deleteDespesa = useDeleteDespesa()

  const handleStatusToggle = async () => {
    try {
      if (tipo === "receita") {
        const receita = item as Receita
        const novoStatus = receita.status === "Pendente" ? "Recebido" : "Pendente"
        await updateReceita.mutateAsync({
          id: receita.id,
          status: novoStatus,
          data_recebimento: novoStatus === "Recebido" ? format(new Date(), "yyyy-MM-dd") : null,
        })
      } else {
        const despesa = item as Despesa
        const novoStatus = despesa.status === "Pendente" ? "Pago" : "Pendente"
        await updateDespesa.mutateAsync({
          id: despesa.id,
          status: novoStatus,
          data_pagamento: novoStatus === "Pago" ? format(new Date(), "yyyy-MM-dd") : null,
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleDelete = async () => {
    // Verificar se é uma receita vinculada a uma OS
    if (tipo === "receita" && (item as Receita).ordem_servico_id) {
      alert("Esta receita está vinculada a uma Ordem de Serviço e não pode ser excluída diretamente. Exclua a OS correspondente se necessário.")
      return
    }

    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        if (tipo === "receita") {
          await deleteReceita.mutateAsync(item.id)
        } else {
          await deleteDespesa.mutateAsync(item.id)
        }
      } catch (error) {
        console.error("Erro ao excluir:", error)
      }
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStatusToggle}
        className="h-8 w-8 p-0"
        disabled={
          updateReceita.isPending || 
          updateDespesa.isPending || 
          (isReceitaOS ? true : false)
        }
        title={isReceitaOS ? "Status controlado pela Ordem de Serviço" : "Alterar status"}
      >
        {statusReal === "Pendente" ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-yellow-600" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        disabled={
          deleteReceita.isPending || 
          deleteDespesa.isPending || 
          (isReceitaOS ? true : false)
        }
        title={isReceitaOS ? "Receita vinculada à OS - não pode ser excluída" : "Excluir"}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
