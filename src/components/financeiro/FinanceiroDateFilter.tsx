
import { useState } from "react"
import { Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FinanceiroDateFilterProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  onClearFilter: () => void
}

export const FinanceiroDateFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilter
}: FinanceiroDateFilterProps) => {
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return "Selecionar data"
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  const hasFilter = startDate || endDate

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium">Período:</span>
      
      {/* Data inicial */}
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {formatDate(startDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={startDate || undefined}
            onSelect={(date) => {
              onStartDateChange(date || null)
              setIsStartOpen(false)
            }}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-sm text-muted-foreground">até</span>

      {/* Data final */}
      <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {formatDate(endDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={endDate || undefined}
            onSelect={(date) => {
              onEndDateChange(date || null)
              setIsEndOpen(false)
            }}
            disabled={(date) => startDate ? date < startDate : false}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Botão para limpar filtro */}
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}
