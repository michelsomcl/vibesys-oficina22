
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useClientes } from "./useClientes"
import { useOrcamentos } from "./useOrcamentos"
import { useOrdensServico } from "./useOrdensServico"
import { useReceitas } from "./useReceitas"
import { useDespesas } from "./useDespesas"

export const useDashboardStats = () => {
  const { data: clientes = [] } = useClientes()
  const { data: orcamentos = [] } = useOrcamentos()
  const { data: ordensServico = [] } = useOrdensServico()
  const { data: receitas = [] } = useReceitas()
  const { data: despesas = [] } = useDespesas()

  const stats = {
    clientesAtivos: clientes.length,
    orcamentosPendentes: orcamentos.filter(o => o.status === "Pendente").length,
    servicosAndamento: ordensServico.filter(os => os.status_servico === "Andamento").length,
    faturamentoMensal: receitas
      .filter(r => r.status === "Recebido" && new Date(r.data_recebimento!).getMonth() === new Date().getMonth())
      .reduce((total, r) => total + r.valor, 0),
    contasRecebidas: receitas
      .filter(r => r.status === "Recebido")
      .reduce((total, r) => total + r.valor, 0),
    contasAReceber: receitas
      .filter(r => r.status === "Pendente")
      .reduce((total, r) => total + r.valor, 0),
    contasEmAtraso: receitas
      .filter(r => r.status === "Pendente" && new Date(r.data_vencimento) < new Date())
      .reduce((total, r) => total + r.valor, 0),
    recentOrders: ordensServico
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(os => ({
        id: os.numero,
        cliente: clientes.find(c => c.id === os.cliente_id)?.nome || "Cliente não encontrado",
        veiculo: `${clientes.find(c => c.id === os.cliente_id)?.marca || ""} ${clientes.find(c => c.id === os.cliente_id)?.modelo || ""}`.trim() || "Veículo não informado",
        status: os.status_servico,
        valor: `R$ ${os.valor_total.toFixed(2).replace(".", ",")}`
      }))
  }

  return { data: stats }
}
