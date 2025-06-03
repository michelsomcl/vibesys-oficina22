
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useCategorias } from "@/hooks/useCategorias"

interface FinanceiroCategoryFilterProps {
  selectedCategoryId: string | null
  onCategoryChange: (categoryId: string | null) => void
  tipo?: "receita" | "despesa" | "ambos"
}

export const FinanceiroCategoryFilter = ({
  selectedCategoryId,
  onCategoryChange,
  tipo = "ambos"
}: FinanceiroCategoryFilterProps) => {
  const { data: categorias = [] } = useCategorias()

  // Filtrar categorias baseado no tipo
  const categoriasFiltradas = categorias.filter(categoria => {
    if (tipo === "ambos") return true
    return categoria.tipo === tipo || categoria.tipo === "ambos"
  })

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="categoria-filter">Filtrar por Categoria</Label>
        <Select value={selectedCategoryId || "all"} onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}>
          <SelectTrigger id="categoria-filter">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categoriasFiltradas.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoria.cor || "#6B7280" }}
                  />
                  {categoria.nome}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedCategoryId && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onCategoryChange(null)}
          title="Limpar filtro de categoria"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
