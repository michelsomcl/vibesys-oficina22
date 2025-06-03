
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FinanceiroCreateDialog } from "@/components/FinanceiroCreateDialog"
import { FinanceiroListItem } from "@/components/FinanceiroListItem"
import { Tables } from "@/integrations/supabase/types"
import { useOrdensServico } from "@/hooks/useOrdensServico"

type Receita = Tables<"receitas">

interface ReceitasListProps {
  receitas: Receita[]
}

export const ReceitasList = ({ receitas }: ReceitasListProps) => {
  const { data: ordensServico = [] } = useOrdensServico()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Receitas</CardTitle>
          <FinanceiroCreateDialog tipo="receita" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {receitas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma receita encontrada. Crie uma nova receita ou finalize uma ordem de serviço.
            </div>
          ) : (
            receitas.map((receita) => {
              // Buscar dados da OS se a receita estiver vinculada
              const ordemServico = receita.ordem_servico_id 
                ? ordensServico.find(os => os.id === receita.ordem_servico_id)
                : undefined

              return (
                <FinanceiroListItem
                  key={receita.id}
                  item={receita}
                  tipo="receita"
                  ordemServico={ordemServico}
                />
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
