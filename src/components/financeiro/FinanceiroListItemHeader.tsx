
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"
import { ReceitaOSBadge } from "./ReceitaOSBadge"

interface FinanceiroListItemHeaderProps {
  numero: string
  status: string
  isReceitaOS: boolean
  osNumero?: string
  valorPago: number
  valorTotal: number
}

export const FinanceiroListItemHeader = ({
  numero,
  status,
  isReceitaOS,
  osNumero,
  valorPago,
  valorTotal
}: FinanceiroListItemHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebido":
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "Pendente" ? (
      <Clock className="w-4 h-4" />
    ) : (
      <CheckCircle className="w-4 h-4" />
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium text-sm text-muted-foreground">{numero}</span>
      <Badge className={getStatusColor(status)}>
        <div className="flex items-center gap-1">
          {getStatusIcon(status)}
          {status}
        </div>
      </Badge>
      {isReceitaOS && (
        <ReceitaOSBadge 
          osNumero={osNumero} 
          valorPago={valorPago}
          valorTotal={valorTotal}
        />
      )}
    </div>
  )
}
