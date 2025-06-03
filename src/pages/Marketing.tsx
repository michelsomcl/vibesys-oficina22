
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Calendar,
  Phone,
  Search,
  Gift
} from "lucide-react"
import { useMarketing } from "@/hooks/useMarketing"

// Função para converter data YYYY-MM-DD para dd/mm/aaaa
const formatDateForDisplay = (dateStr: string | null): string => {
  if (!dateStr) return ""
  
  // Se está no formato YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
  }
  
  return dateStr
}

const Marketing = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: marketing = [], isLoading } = useMarketing()

  // Filtrar dados baseado na busca
  const filteredMarketing = marketing.filter(contact => 
    contact.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefone?.includes(searchTerm) ||
    (contact.data_aniversario && formatDateForDisplay(contact.data_aniversario).includes(searchTerm))
  )

  // Função para verificar se o aniversário é próximo (próximos 30 dias)
  const isUpcomingBirthday = (dateStr: string | null) => {
    if (!dateStr) return false
    
    try {
      // Converter YYYY-MM-DD para Date
      const birthDate = new Date(dateStr)
      if (isNaN(birthDate.getTime())) return false
      
      const today = new Date()
      const currentYear = today.getFullYear()
      
      // Ajustar para o ano atual
      const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())
      
      // Se já passou este ano, verificar no próximo ano
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(currentYear + 1)
      }
      
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      
      return thisYearBirthday >= today && thisYearBirthday <= thirtyDaysFromNow
    } catch {
      return false
    }
  }

  // Aniversariantes próximos
  const upcomingBirthdays = filteredMarketing.filter(contact => 
    isUpcomingBirthday(contact.data_aniversario)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando dados de marketing...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
        <p className="text-muted-foreground">Gestão de contatos e relacionamento com clientes</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Contatos
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{marketing.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Aniversário
            </CardTitle>
            <div className="p-2 rounded-lg bg-secondary">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {marketing.filter(c => c.data_aniversario).length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Telefone
            </CardTitle>
            <div className="p-2 rounded-lg bg-accent">
              <Phone className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {marketing.filter(c => c.telefone).length}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aniversários Próximos
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-500">
              <Gift className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{upcomingBirthdays.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Contatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome, telefone ou data de aniversário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Contatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contatos de Marketing ({filteredMarketing.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredMarketing.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{contact.nome_cliente}</div>
                    {contact.data_aniversario && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateForDisplay(contact.data_aniversario)}
                      </div>
                    )}
                    {contact.telefone && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.telefone}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {isUpcomingBirthday(contact.data_aniversario) && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Aniversário Próximo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {filteredMarketing.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum contato encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aniversariantes Próximos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Aniversários Próximos (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {upcomingBirthdays.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{contact.nome_cliente}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateForDisplay(contact.data_aniversario)}
                    </div>
                    {contact.telefone && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.telefone}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className="bg-orange-100 text-orange-800">
                      <Gift className="h-3 w-3 mr-1" />
                      Próximo
                    </Badge>
                  </div>
                </div>
              ))}
              {upcomingBirthdays.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum aniversário nos próximos 30 dias
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Marketing
