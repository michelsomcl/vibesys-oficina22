
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import { Tables } from "@/integrations/supabase/types"
import { useOrdensServico } from "@/hooks/useOrdensServico"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroSummaryCardsProps {
  receitas: Receita[]
  despesas: Despesa[]
}

export const FinanceiroSummaryCards = ({ receitas, despesas }: FinanceiroSummaryCardsProps) => {
  const { data: ordensServico = [] } = useOrdensServico()

  // Calcular valores das receitas considerando pagamentos parciais das OS
  let totalReceitasRecebidas = 0
  let totalReceitasPendentes = 0
  let countReceitasRecebidas = 0
  let countReceitasPendentes = 0

  receitas.forEach(receita => {
    if (receita.ordem_servico_id) {
      // Receita vinculada a OS - calcular baseado nos pagamentos da OS
      const os = ordensServico.find(o => o.id === receita.ordem_servico_id)
      if (os) {
        const valorTotal = os.valor_total - (os.desconto || 0)
        const valorPago = os.valor_pago || 0
        const valorAPagar = valorTotal - valorPago

        if (valorPago > 0) {
          totalReceitasRecebidas += valorPago
          if (valorAPagar <= 0) {
            countReceitasRecebidas++
          }
        }
        
        if (valorAPagar > 0) {
          totalReceitasPendentes += valorAPagar
          countReceitasPendentes++
        } else if (valorPago === 0) {
          totalReceitasPendentes += valorTotal
          countReceitasPendentes++
        }
      }
    } else {
      // Receita normal
      if (receita.status === "Recebido") {
        totalReceitasRecebidas += Number(receita.valor)
        countReceitasRecebidas++
      } else {
        totalReceitasPendentes += Number(receita.valor)
        countReceitasPendentes++
      }
    }
  })

  const despesasPagas = despesas.filter(d => d.status === "Pago")
  const despesasPendentes = despesas.filter(d => d.status === "Pendente")

  const totalDespesasPagas = despesasPagas.reduce((sum, d) => sum + Number(d.valor), 0)
  const totalDespesasPendentes = despesasPendentes.reduce((sum, d) => sum + Number(d.valor), 0)

  // Calcular saldo (receitas recebidas - despesas pagas)
  const saldo = totalReceitasRecebidas - totalDespesasPagas
  const saldoPositivo = saldo >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Receber</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            R$ {totalReceitasPendentes.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {countReceitasPendentes} receitas pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebido</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalReceitasRecebidas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {countReceitasRecebidas} receitas recebidas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
          <Clock className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalDespesasPendentes.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {despesasPendentes.length} despesas pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pago</CardTitle>
          <TrendingDown className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            R$ {totalDespesasPagas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {despesasPagas.length} despesas pagas
          </p>
        </CardContent>
      </Card>

      {/* Novo card de saldo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          {saldoPositivo ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <DollarSign className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${saldoPositivo ? "text-green-600" : "text-red-600"}`}>
            R$ {Math.abs(saldo).toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {saldoPositivo ? "Lucro" : "Prejuízo"} atual
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
