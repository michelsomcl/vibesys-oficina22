
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tables } from "@/integrations/supabase/types"
import { ReceitasList } from "./ReceitasList"
import { DespesasList } from "./DespesasList"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroTabsProps {
  receitas: Receita[]
  despesas: Despesa[]
}

export const FinanceiroTabs = ({ receitas, despesas }: FinanceiroTabsProps) => {
  return (
    <Tabs defaultValue="receitas" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="receitas">Receitas</TabsTrigger>
        <TabsTrigger value="despesas">Despesas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="receitas">
        <ReceitasList receitas={receitas} />
      </TabsContent>
      
      <TabsContent value="despesas">
        <DespesasList despesas={despesas} />
      </TabsContent>
    </Tabs>
  )
}
