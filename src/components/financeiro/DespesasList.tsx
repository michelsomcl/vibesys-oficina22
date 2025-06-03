
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FinanceiroCreateDialog } from "@/components/FinanceiroCreateDialog"
import { FinanceiroListItem } from "@/components/FinanceiroListItem"
import { Tables } from "@/integrations/supabase/types"

type Despesa = Tables<"despesas">

interface DespesasListProps {
  despesas: Despesa[]
}

export const DespesasList = ({ despesas }: DespesasListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Despesas</CardTitle>
          <FinanceiroCreateDialog tipo="despesa" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {despesas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma despesa encontrada. Crie uma nova despesa.
            </div>
          ) : (
            despesas.map((despesa) => (
              <FinanceiroListItem
                key={despesa.id}
                item={despesa}
                tipo="despesa"
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
