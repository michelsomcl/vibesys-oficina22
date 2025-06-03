
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  DollarSign, 
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useMarketing } from "@/hooks/useMarketing"

const Dashboard = () => {
  const { data: stats } = useDashboardStats()
  const { data: marketing = [] } = useMarketing()

  // Função para verificar se o aniversário é hoje ou nos próximos dias
  const isUpcomingBirthday = (dateStr: string | null) => {
    if (!dateStr) return false
    
    try {
      const [day, month] = dateStr.split("/")
      if (!day || !month) return false
      
      const currentYear = new Date().getFullYear()
      const birthDate = new Date(currentYear, parseInt(month) - 1, parseInt(day))
      const today = new Date()
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(today.getDate() + 7)
      
      // Se já passou este ano, verificar no próximo ano
      if (birthDate < today) {
        birthDate.setFullYear(currentYear + 1)
      }
      
      return birthDate >= today && birthDate <= sevenDaysFromNow
    } catch {
      return false
    }
  }

  const aniversariantes = marketing
    .filter(contact => isUpcomingBirthday(contact.data_aniversario))
    .slice(0, 3)

  const dashboardStats = [
    { 
      title: "Clientes Ativos", 
      value: stats.clientesAtivos.toString(), 
      icon: Users, 
      color: "bg-primary" 
    },
    { 
      title: "Orçamentos Pendentes", 
      value: stats.orcamentosPendentes.toString(), 
      icon: FileText, 
      color: "bg-secondary" 
    },
    { 
      title: "Faturamento Mensal", 
      value: `R$ ${stats.faturamentoMensal.toFixed(2).replace(".", ",")}`, 
      icon: DollarSign, 
      color: "bg-accent" 
    },
    { 
      title: "Serviços em Andamento", 
      value: stats.servicosAndamento.toString(), 
      icon: Clock, 
      color: "bg-muted" 
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-800"
      case "Finalizado":
        return "bg-blue-100 text-blue-800"
      case "Andamento":
        return "bg-yellow-100 text-yellow-800"
      case "Aguardando Peças":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ordens de Serviço Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ordens de Serviço Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.cliente}</div>
                    <div className="text-xs text-muted-foreground">{order.veiculo}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="text-sm font-medium text-foreground">{order.valor}</div>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma ordem de serviço encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aniversariantes da Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aniversariantes - Próximos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aniversariantes.map((pessoa) => (
                <div key={pessoa.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{pessoa.nome_cliente}</div>
                    <div className="text-sm text-muted-foreground">{pessoa.telefone || "Telefone não informado"}</div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-accent text-accent-foreground">
                      {pessoa.data_aniversario}
                    </Badge>
                  </div>
                </div>
              ))}
              {aniversariantes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum aniversário nos próximos 7 dias
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                R$ {stats.contasRecebidas.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-sm text-muted-foreground">Contas Recebidas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                R$ {stats.contasAReceber.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-sm text-muted-foreground">Contas a Receber</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                R$ {stats.contasEmAtraso.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-sm text-muted-foreground">Contas em Atraso</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
