
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Tags } from "lucide-react"
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from "@/hooks/useCategorias"
import { Tables } from "@/integrations/supabase/types"

type Categoria = Tables<"categorias">

export const CategoriasDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState<"receita" | "despesa" | "ambos">("receita")
  const [cor, setCor] = useState("#6B7280")

  const { data: categorias = [] } = useCategorias()
  const createCategoria = useCreateCategoria()
  const updateCategoria = useUpdateCategoria()
  const deleteCategoria = useDeleteCategoria()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategoria) {
      await updateCategoria.mutateAsync({
        id: editingCategoria.id,
        nome,
        tipo,
        cor
      })
    } else {
      await createCategoria.mutateAsync({
        nome,
        tipo,
        cor
      })
    }
    
    resetForm()
  }

  const resetForm = () => {
    setNome("")
    setTipo("receita")
    setCor("#6B7280")
    setEditingCategoria(null)
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setNome(categoria.nome)
    setTipo(categoria.tipo as "receita" | "despesa" | "ambos")
    setCor(categoria.cor || "#6B7280")
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      await deleteCategoria.mutateAsync(id)
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "receita":
        return "bg-green-100 text-green-800"
      case "despesa":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Tags className="w-4 h-4 mr-2" />
          Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome da categoria"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as "receita" | "despesa" | "ambos")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cor">Cor</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="cor"
                    type="color"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    placeholder="#6B7280"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createCategoria.isPending || updateCategoria.isPending}
                >
                  {editingCategoria ? "Atualizar" : "Criar"}
                </Button>
                {editingCategoria && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de categorias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorias Existentes</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: categoria.cor || "#6B7280" }}
                    />
                    <span className="font-medium">{categoria.nome}</span>
                    <Badge className={getTipoColor(categoria.tipo)}>
                      {categoria.tipo}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(categoria.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
