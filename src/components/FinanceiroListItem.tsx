
import { Tables } from "@/integrations/supabase/types"
import { FinanceiroListItemHeader } from "@/components/financeiro/FinanceiroListItemHeader"
import { FinanceiroListItemDetails } from "@/components/financeiro/FinanceiroListItemDetails"
import { FinanceiroListItemValue } from "@/components/financeiro/FinanceiroListItemValue"
import { FinanceiroListItemActions } from "@/components/financeiro/FinanceiroListItemActions"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroListItemProps {
  item: Receita | Despesa
  tipo: "receita" | "despesa"
  ordemServico?: any // Dados da OS se for receita vinculada
}

export const FinanceiroListItem = ({ item, tipo, ordemServico }: FinanceiroListItemProps) => {
  // Verificar se é uma receita vinculada a OS
  const isReceitaOS = tipo === "receita" && !!(item as Receita).ordem_servico_id
  const osNumero = isReceitaOS ? item.descricao.split(' ').pop() : undefined

  // Calcular valores para receitas vinculadas a OS
  const valorPago = ordemServico?.valor_pago || 0
  const valorTotal = ordemServico ? (ordemServico.valor_total - (ordemServico.desconto || 0)) : Number(item.valor)
  const valorAPagar = valorTotal - valorPago

  // Para receitas de OS, determinar o status real baseado no pagamento
  let statusReal = item.status
  if (isReceitaOS && ordemServico) {
    if (valorAPagar <= 0) {
      statusReal = "Recebido"
    } else {
      statusReal = "Pendente"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex-1 space-y-1">
        <FinanceiroListItemHeader
          numero={item.numero}
          status={statusReal}
          isReceitaOS={isReceitaOS}
          osNumero={osNumero}
          valorPago={valorPago}
          valorTotal={valorTotal}
        />
        
        <FinanceiroListItemDetails
          item={item}
          tipo={tipo}
          statusReal={statusReal}
          isReceitaOS={isReceitaOS}
          valorPago={valorPago}
          valorAPagar={valorAPagar}
        />
      </div>

      <div className="flex items-center gap-4">
        <FinanceiroListItemValue
          valor={Number(item.valor)}
          tipo={tipo}
          valorTotal={valorTotal}
          isReceitaOS={isReceitaOS}
        />
        
        <FinanceiroListItemActions
          item={item}
          tipo={tipo}
          statusReal={statusReal}
          isReceitaOS={isReceitaOS}
        />
      </div>
    </div>
  )
}
