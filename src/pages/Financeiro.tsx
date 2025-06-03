
import { useState } from "react"
import { useReceitas } from "@/hooks/useReceitas"
import { useDespesas } from "@/hooks/useDespesas"
import { FinanceiroSummaryCards } from "@/components/financeiro/FinanceiroSummaryCards"
import { FinanceiroHeader } from "@/components/financeiro/FinanceiroHeader"
import { FinanceiroTabs } from "@/components/financeiro/FinanceiroTabs"
import { FinanceiroLoading } from "@/components/financeiro/FinanceiroLoading"
import { FinanceiroDateFilter } from "@/components/financeiro/FinanceiroDateFilter"
import { FinanceiroCategoryFilter } from "@/components/financeiro/FinanceiroCategoryFilter"
import { CategoriasDialog } from "@/components/financeiro/CategoriasDialog"
import { isWithinInterval, startOfDay, endOfDay } from "date-fns"

const Financeiro = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const { data: receitas = [], isLoading: loadingReceitas } = useReceitas()
  const { data: despesas = [], isLoading: loadingDespesas } = useDespesas()

  // Filtrar receitas por data e categoria
  const filteredReceitas = receitas.filter(receita => {
    // Filtro por data
    if (startDate || endDate) {
      const dataVencimento = new Date(receita.data_vencimento)
      
      if (startDate && endDate) {
        if (!isWithinInterval(dataVencimento, {
          start: startOfDay(startDate),
          end: endOfDay(endDate)
        })) return false
      } else if (startDate) {
        if (dataVencimento < startOfDay(startDate)) return false
      } else if (endDate) {
        if (dataVencimento > endOfDay(endDate)) return false
      }
    }
    
    // Filtro por categoria
    if (selectedCategoryId && receita.categoria_id !== selectedCategoryId) {
      return false
    }
    
    return true
  })

  // Filtrar despesas por data e categoria
  const filteredDespesas = despesas.filter(despesa => {
    // Filtro por data
    if (startDate || endDate) {
      const dataVencimento = new Date(despesa.data_vencimento)
      
      if (startDate && endDate) {
        if (!isWithinInterval(dataVencimento, {
          start: startOfDay(startDate),
          end: endOfDay(endDate)
        })) return false
      } else if (startDate) {
        if (dataVencimento < startOfDay(startDate)) return false
      } else if (endDate) {
        if (dataVencimento > endOfDay(endDate)) return false
      }
    }
    
    // Filtro por categoria
    if (selectedCategoryId && despesa.categoria_id !== selectedCategoryId) {
      return false
    }
    
    return true
  })

  const handleClearDateFilter = () => {
    setStartDate(null)
    setEndDate(null)
  }

  const handleClearCategoryFilter = () => {
    setSelectedCategoryId(null)
  }

  const handleClearAllFilters = () => {
    handleClearDateFilter()
    handleClearCategoryFilter()
  }

  if (loadingReceitas || loadingDespesas) {
    return <FinanceiroLoading />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <FinanceiroHeader 
          title="Financeiro" 
          subtitle="Controle suas receitas e despesas" 
        />
        <CategoriasDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinanceiroDateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClearFilter={handleClearDateFilter}
        />
        
        <FinanceiroCategoryFilter
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          tipo="ambos"
        />
      </div>

      {(startDate || endDate || selectedCategoryId) && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      <FinanceiroSummaryCards receitas={filteredReceitas} despesas={filteredDespesas} />

      <FinanceiroTabs receitas={filteredReceitas} despesas={filteredDespesas} />
    </div>
  )
}

export default Financeiro
