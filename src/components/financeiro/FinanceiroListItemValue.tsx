
interface FinanceiroListItemValueProps {
  valor: number
  tipo: "receita" | "despesa"
  valorTotal?: number
  isReceitaOS: boolean
}

export const FinanceiroListItemValue = ({
  valor,
  tipo,
  valorTotal,
  isReceitaOS
}: FinanceiroListItemValueProps) => {
  return (
    <div className="text-right">
      <div className={`text-lg font-bold ${tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
        {tipo === "receita" ? "+" : "-"}R$ {valor.toFixed(2).replace(".", ",")}
      </div>
      {/* Mostrar valor total da OS se for diferente do valor da receita */}
      {isReceitaOS && valorTotal && valorTotal !== valor && (
        <div className="text-sm text-muted-foreground">
          Total OS: R$ {valorTotal.toFixed(2).replace(".", ",")}
        </div>
      )}
    </div>
  )
}
