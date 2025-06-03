
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

interface ReceitaOSBadgeProps {
  osNumero?: string
  valorPago?: number
  valorTotal?: number
}

export const ReceitaOSBadge = ({ osNumero, valorPago = 0, valorTotal = 0 }: ReceitaOSBadgeProps) => {
  if (!osNumero) return null

  const isParcial = valorPago > 0 && valorPago < valorTotal

  return (
    <div className="flex gap-2">
      <Badge variant="outline" className="text-xs">
        <FileText className="w-3 h-3 mr-1" />
        OS: {osNumero}
      </Badge>
      {isParcial && (
        <Badge variant="secondary" className="text-xs">
          Pagamento Parcial
        </Badge>
      )}
    </div>
  )
}
